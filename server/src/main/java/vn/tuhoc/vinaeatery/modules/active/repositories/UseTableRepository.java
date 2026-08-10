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

import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.UseTableEntityGraph;

public interface UseTableRepository
                extends JpaRepository<UseTableEntity, Long>, JpaSpecificationExecutor<UseTableEntity> {
        @Query("""
                            select distinct ut
                            from UseTableEntity ut
                            where ut.id = :id
                        """)
        Optional<UseTableEntity> findOneByIdToCrud(@Param("id") Long id);

        @EntityGraph(value = UseTableEntityGraph.HALF)
        @Query("""
                                select distinct ut
                                from UseTableEntity ut
                                left join fetch ut.paymentMachine pm
                                left join fetch pm.paymentMachineFoods pmf
                                left join fetch pmf.food f
                                left join fetch f.categoryFood
                                left join fetch ut.reservation
                                where ut.id = :id
                        """)
        Optional<UseTableEntity> findOneById(@Param("id") Long id);

        @Query("""
                                select distinct ut
                                from UseTableEntity ut
                                left join fetch ut.restaurant
                                left join fetch ut.table t
                                left join fetch t.floor
                                left join fetch t.categoryTable
                                left join fetch ut.menu m
                                left join fetch m.menuDetails md
                                left join fetch md.food f
                                left join fetch f.categoryFood
                                where ut.restaurant.id = :restaurantId
                                        and ut.table.id = :tableId
                                        and ut.endAt is NULL
                        """)
        Optional<UseTableEntity> findOneByRestaurantIdTableIdAndEndAtIsNull(
                        @Param("restaurantId") Integer restaurantId,
                        @Param("tableId") Integer tableId);

        @EntityGraph(value = UseTableEntityGraph.ONLY_TABLE)
        Page<UseTableEntity> findAll(Specification<UseTableEntity> specification, Pageable pageable);

        @Query("""
                        select distinct ut
                        from UseTableEntity ut
                        left join fetch ut.table t
                        left join fetch t.floor
                        left join fetch t.categoryTable
                        left join fetch ut.bill b
                        left join fetch b.billDetails bd
                        where ut.restaurant.id = :restaurantId
                          and b is not null
                          and b.status = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum.CONFIRMED
                          and b.paymentStatus = vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum.PAID
                          and b.createAt between :createAtStart and :createAtEnd
                        order by t.id asc
                               """)
        List<UseTableEntity> findAllInTimeRange(
                        @Param("restaurantId") Integer restaurantId,
                        @Param("createAtStart") String createAtStart,
                        @Param("createAtEnd") String createAtEnd);
}