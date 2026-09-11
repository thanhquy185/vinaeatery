package vn.tuhoc.vinaeatery.modules.auth.services.interfaces;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionUpdateRevokedAtRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthSessionInfoResponseDTO;

public interface AuthSessionService {
    AuthSessionEntity handleGetByUserIdAndRevokedIsNull(Integer userId);

    AuthSessionEntity getValidSessionByUserId(Integer userId);

    AuthSessionEntity getValidSessionByRefreshToken(String refreshToken);

    AuthSessionInfoResponseDTO handleCreate(AuthSessionCreateRequestDTO authSessionCreateRequestDTO);

    AuthSessionInfoResponseDTO handleUpdateRevokedAt(
            AuthSessionUpdateRevokedAtRequestDTO authSessionUpdateRevokedAtRequestDTO);

    void handleChangeRefreshToken(Integer userId, String currentRefreshToken, String newRefreshToken);
}
