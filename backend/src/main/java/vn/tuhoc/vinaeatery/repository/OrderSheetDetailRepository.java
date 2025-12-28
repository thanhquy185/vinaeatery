package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetailId;

@Repository
public interface OrderSheetDetailRepository
        extends JpaRepository<OrderSheetDetail, OrderSheetDetailId>, JpaSpecificationExecutor<OrderSheetDetail> {
    // Methods
    OrderSheetDetail findOneById(OrderSheetDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.order_sheet_details WHERE order_sheet_id = :order_sheet_id", nativeQuery = true)
    List<OrderSheetDetail> findAllByOrderSheetId(@Param("order_sheet_id") Integer orderSheetId);

    void deleteById(OrderSheetDetailId id);
}
