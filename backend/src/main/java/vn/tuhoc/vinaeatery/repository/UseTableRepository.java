package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.UseTable;


@Repository
public interface UseTableRepository
        extends JpaRepository<UseTable, Long>, JpaSpecificationExecutor<UseTable> {
    // Methods
    UseTable findOneById(Long id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.use_tables WHERE table_id = :table_id AND time_end IS NULL", nativeQuery = true)
    UseTable findNewOneByTableId(@Param("table_id") Integer tableId);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.use_tables WHERE customer_id = :customer_id AND time_end IS NULL", nativeQuery = true)
    UseTable findNewOneByCustomerId(@Param("customer_id") Integer customerId);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.use_tables WHERE order_table_id = :order_table_id AND time_end IS NULL", nativeQuery = true)
    UseTable findNewOneByOrderTableId(@Param("order_table_id") Integer orderTableId);

    void deleteById(Long id);
}