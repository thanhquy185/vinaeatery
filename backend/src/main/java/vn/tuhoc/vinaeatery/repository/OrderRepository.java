package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.Order;

@Repository
public interface OrderRepository  extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
     // Methods
    Order findOneById(Integer id);

    void deleteById(Integer id);
}
