package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Customer;

@Repository
public interface CustomerRepository
        extends JpaRepository<Customer, Integer>, JpaSpecificationExecutor<Customer> {
    // Methods
    Customer findOneById(Integer id);

    Customer findOneByUserId(Integer userId);

    Customer findOneByPhone(String phone);

    Customer findOneByEmail(String email);

    void deleteById(Integer id);
}