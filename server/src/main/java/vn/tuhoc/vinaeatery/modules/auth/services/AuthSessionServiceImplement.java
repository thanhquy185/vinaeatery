package vn.tuhoc.vinaeatery.modules.auth.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.AuthSessionMapper;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionUpdateRevokedAtRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthSessionInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthAccessTokenIsNotValidException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthSessionNotFoundByRefreshTokenException;
import vn.tuhoc.vinaeatery.modules.auth.repositories.AuthSessionRepository;
import vn.tuhoc.vinaeatery.modules.auth.services.interfaces.AuthSessionService;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthSessionServiceImplement implements AuthSessionService {
    @Value("${jwt.refresh-token-validity-in-seconds}")
    Long jwtRefreshTokenExpiration;
    final TimeService timeService;
    final AuthSessionRepository authSessionRepository;
    final AuthSessionMapper authSessionMapper;

    private AuthSessionEntity getOneByUserIdAndRevokedIsNull(Integer userId) {
        return this.authSessionRepository.findOneByUserIdAndRevokedAtIsNull(userId).orElse(null);
    }

    private AuthSessionEntity getOneByRefreshToken(String refreshToken) {
        return this.authSessionRepository.findOneByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthSessionNotFoundByRefreshTokenException());
    }

    @Override
    public AuthSessionEntity handleGetByUserIdAndRevokedIsNull(Integer userId) {
        return this.getOneByUserIdAndRevokedIsNull(userId);
    }

    @Override
    public AuthSessionEntity getValidSessionByUserId(Integer userId) {
        AuthSessionEntity authSessionEntity = this.getOneByUserIdAndRevokedIsNull(userId);

        if (authSessionEntity == null) {
            return null;
        }

        String currentDatetime = this.timeService.getCurrentDatetime();
        if (this.timeService.getLocalDateTime(authSessionEntity.getExpiredAt())
                .isAfter(this.timeService.getLocalDateTime(currentDatetime))) {
            return authSessionEntity;
        }

        authSessionEntity.setRevokedAt(this.timeService.getCurrentDatetime());

        return null;
    }

    @Override
    public AuthSessionEntity getValidSessionByRefreshToken(String refreshToken) {
        AuthSessionEntity authSessionEntity = this.getOneByRefreshToken(refreshToken);

        if (authSessionEntity.getRevokedAt() != null) {
            throw new AuthAccessTokenIsNotValidException();
        }

        String currentDatetime = this.timeService.getCurrentDatetime();
        if (!this.timeService.getLocalDateTime(authSessionEntity.getExpiredAt())
                .isAfter(this.timeService.getLocalDateTime(currentDatetime))) {
            throw new AuthAccessTokenIsNotValidException();
        }

        return authSessionEntity;
    }

    @Override
    public AuthSessionInfoResponseDTO handleCreate(AuthSessionCreateRequestDTO authSessionCreateRequestDTO) {
        AuthSessionEntity authSessionEntity = this.authSessionMapper
                .createEntityFromRequest(authSessionCreateRequestDTO.getUserId(), authSessionCreateRequestDTO);

        return this.authSessionMapper.entityToInfoResponse(this.authSessionRepository.save(authSessionEntity));
    }

    @Override
    public AuthSessionInfoResponseDTO handleUpdateRevokedAt(
            AuthSessionUpdateRevokedAtRequestDTO authSessionUpdateRevokedAtRequestDTO) {
        AuthSessionEntity authSessionEntity = this
                .getOneByRefreshToken(authSessionUpdateRevokedAtRequestDTO.getRefreshToken());
        authSessionEntity.setRevokedAt(this.timeService.getCurrentDatetime());

        return this.authSessionMapper.entityToInfoResponse(this.authSessionRepository.save(authSessionEntity));
    }

    @Override
    public void handleChangeRefreshToken(Integer userId, String currentRefreshToken, String newRefreshToken) {
        AuthSessionEntity authSessionEntityExists = this.getOneByUserIdAndRevokedIsNull(userId);
        if (ValidationUtil.nonNull(authSessionEntityExists)
                && authSessionEntityExists.getRefreshToken().equalsIgnoreCase(currentRefreshToken)) {
            authSessionEntityExists.setRevokedAt(this.timeService.getCurrentDatetime());
        }

        LocalDateTime currentDateTime = LocalDateTime.now();
        AuthSessionCreateRequestDTO authSessionCreateRequestDTO = AuthSessionCreateRequestDTO.builder()
                .userId(userId)
                .createAt(this.timeService.getDatetime(currentDateTime))
                .expiredAt(this.timeService.getDatetime(currentDateTime.plusSeconds(this.jwtRefreshTokenExpiration)))
                .refreshToken(newRefreshToken)
                .build();

        AuthSessionEntity authSessionEntity = this.authSessionMapper.createEntityFromRequest(
                userId,
                authSessionCreateRequestDTO);
        this.authSessionRepository.save(authSessionEntity);
    }
}
