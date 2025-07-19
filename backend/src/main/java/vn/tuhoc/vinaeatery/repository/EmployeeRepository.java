package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
    // Methods
    Employee findOneById(Integer id);

    Employee findOneByUsername(String username);

    Employee findOneByUsernameAndPassword(String username, String password);

    Employee findOneByUsernameAndRefreshToken(String username, String refreshToken);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.employees ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Employee findLastOne();

    void deleteById(Integer id);
}