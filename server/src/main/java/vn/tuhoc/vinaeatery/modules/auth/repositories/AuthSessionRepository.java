package vn.tuhoc.vinaeatery.modules.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;

public interface AuthSessionRepository
        extends JpaRepository<AuthSessionEntity, Integer>, JpaSpecificationExecutor<AuthSessionEntity> {
    Optional<AuthSessionEntity> findOneByUserIdAndRevokedAtIsNull(Integer userId);

    Optional<AuthSessionEntity> findOneByRefreshToken(String refreshToken);
}
