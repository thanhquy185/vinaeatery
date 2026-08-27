package vn.tuhoc.vinaeatery.modules.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<UserEntity> {
    Optional<UserEntity> findOneByUsername(String username);

    Optional<UserEntity> findOneByUsernameAndPassword(String username, String password);

    Boolean existsByUsername(String username);
}