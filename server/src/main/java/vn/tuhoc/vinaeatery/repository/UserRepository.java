package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    // Methods
    User findOneById(Integer id);

    User findOneByUsername(String username);

    User findOneByUsernameAndPassword(String username, String password);

    User findOneByUsernameAndRefreshToken(String username, String refreshToken);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.users ORDER BY id DESC LIMIT 1", nativeQuery = true)
    User findLastOne();

    void deleteById(Integer id);
}