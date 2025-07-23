package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;

@Repository
public interface OrderDetailRepository
        extends JpaRepository<OrderDetail, OrderDetailId>, JpaSpecificationExecutor<OrderDetail> {
    // Methods
    OrderDetail findOneById(OrderDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.order_details WHERE order_id = :order_id", nativeQuery = true)
    List<OrderDetail> findAllByOrderId(@Param("order_id") Integer orderId);

    void deleteById(OrderDetailId id);
}
