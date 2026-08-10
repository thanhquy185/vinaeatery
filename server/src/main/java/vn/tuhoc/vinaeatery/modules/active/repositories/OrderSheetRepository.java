package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.OrderSheetEntityGraph;

public interface OrderSheetRepository
        extends JpaRepository<OrderSheetEntity, Integer>, JpaSpecificationExecutor<OrderSheetEntity> {
    @Query("""
                select distinct os
                from OrderSheetEntity os
                where os.id = :id
            """)
    Optional<OrderSheetEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = OrderSheetEntityGraph.HALF)
    @Query("""
                select distinct os
                from OrderSheetEntity os
                left join fetch os.restaurant
                left join fetch os.useTable ut
                left join fetch ut.table t
                left join fetch t.floor
                left join fetch t.categoryTable
                left join fetch os.orderSheetDetails osd
                left join fetch osd.food f
                left join fetch f.categoryFood cf
                where os.id = :id
            """)
    Optional<OrderSheetEntity> findOneById(@Param("id") Integer id);

    // Vì Order Sheet -> Use Table -> Table -> Floor and Category Table (4 cấp)
    // Nên không thể dùng cách @EntityGraph, @Quey hay @NameEntityGraph
    // Mà dùng join fetch trong Specification
    Page<OrderSheetEntity> findAll(Specification<OrderSheetEntity> specification, Pageable pageable);

    @Query("""
                select distinct os
                from OrderSheetEntity os
                left join fetch os.orderSheetDetails osd
                left join fetch osd.food f
                left join fetch f.categoryFood cf
                where os.useTable.id = :useTableId
            """)
    List<OrderSheetEntity> findAllByUseTableId(@Param("useTableId") Long useTableId);
}
