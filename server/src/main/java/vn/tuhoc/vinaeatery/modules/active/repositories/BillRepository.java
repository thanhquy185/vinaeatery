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

import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.BillEntityGraph;

public interface BillRepository
        extends JpaRepository<BillEntity, Integer>, JpaSpecificationExecutor<BillEntity> {
    @Query("""
                select distinct b
                from BillEntity b
                where b.id = :id
            """)
    Optional<BillEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = BillEntityGraph.HALF)
    @Query("""
                select distinct b
                from BillEntity b
                left join fetch b.billDetails bd
                left join fetch bd.food f
                left join fetch f.categoryFood cf
                where b.id = :id
            """)
    Optional<BillEntity> findOneById(@Param("id") Integer id);

    @EntityGraph(value = BillEntityGraph.ONLY_PAYMENT_METHOD)
    Page<BillEntity> findAll(Specification<BillEntity> specification, Pageable pageable);

    @EntityGraph(value = BillEntityGraph.ONLY_PAYMENT_METHOD)
    @Query("""
                    select distinct b
                    from BillEntity b
                    left join fetch b.billDetails bd
                    left join fetch bd.food f
                    left join fetch f.categoryFood cf
                    where b.customer.id = :customerId
            """)
    List<BillEntity> findAllByCustomerId(@Param("customerId") Integer customerId);

    @Query("""
                select distinct b
                from BillEntity b
                where b.restaurant.id = :restaurantId
                  and b.status = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum.CONFIRMED
                  and b.paymentStatus = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum.PAID
                  and b.createAt between :createAtStart and :createAtEnd
                order by b.createAt asc
            """)
    List<BillEntity> findAllInTimeRange(
            @Param("restaurantId") Integer restaurantId,
            @Param("createAtStart") String createAtStart,
            @Param("createAtEnd") String createAtEnd);

    @Query("""
                select distinct b
                from BillEntity b
                left join fetch b.billDetails bds
                left join fetch bds.food f
                left join fetch f.categoryFood
                where b.restaurant.id = :restaurantId
                  and b.status = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum.CONFIRMED
                  and b.paymentStatus = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum.PAID
                  and b.createAt between :createAtStart and :createAtEnd
                order by b.createAt asc
            """)
    List<BillEntity> findAllWithDetailsInTimeRange(
            @Param("restaurantId") Integer restaurantId,
            @Param("createAtStart") String createAtStart,
            @Param("createAtEnd") String createAtEnd);
}
