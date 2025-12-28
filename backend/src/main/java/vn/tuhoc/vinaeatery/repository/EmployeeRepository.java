package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
    // Methods
    Employee findOneById(Integer id);

    Employee findOneByUserId(Integer userId);

    List<Employee> findAllByRestaurantId(Integer restaurantId);

    void deleteById(Integer id);
}