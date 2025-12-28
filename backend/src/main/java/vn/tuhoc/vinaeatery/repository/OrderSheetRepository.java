package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheet;

@Repository
public interface OrderSheetRepository extends JpaRepository<OrderSheet, Integer>, JpaSpecificationExecutor<OrderSheet> {
  // Methods
  OrderSheet findOneById(Integer id);

  @Transactional
  @Query(value = """
      SELECT os.*
      FROM vinaeatery.order_sheets AS os
      JOIN vinaeatery.use_tables AS ut ON os.table_id = ut.table_id
      WHERE ut.id = :use_table_id AND ut.table_id = :table_id
        AND (
              (os.create_at >= ut.time_start AND ut.time_end IS NULL)
           OR (os.create_at >= ut.time_start AND os.create_at <= ut.time_end)
        )
      """, nativeQuery = true)
  List<OrderSheet> findAllWithUseTable(@Param("use_table_id") Long useTableId, @Param("table_id") Integer tableId);
    
  void deleteById(Integer id);
}
