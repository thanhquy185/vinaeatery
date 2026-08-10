package vn.tuhoc.vinaeatery.modules.food.repositories;

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

import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.SupplierEntityGraph;

public interface SupplierRepository
        extends JpaRepository<SupplierEntity, Integer>, JpaSpecificationExecutor<SupplierEntity> {
    @Query("""
                select distinct s
                from SupplierEntity s
                where s.id = :id
            """)
    Optional<SupplierEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = SupplierEntityGraph.FULL)
    @Query("""
                select distinct s
                from SupplierEntity s
                where s.id = :id
            """)
    Optional<SupplierEntity> findOneById(@Param("id") Integer id);

    Page<SupplierEntity> findAll(Specification<SupplierEntity> specification, Pageable pageable);

    @Query("""
                select s
                from SupplierEntity s
                 where s.restaurant.id = :restaurantId
            """)
    List<SupplierEntity> findAllByRestaurantId(@Param("restaurantId") Integer restaurantId);

    @Query("""
                select s
                from SupplierEntity s
                where s.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<SupplierEntity> findAllCrud();

    @Query("""
                select s
                from SupplierEntity s
                where s.restaurant.id = :restaurantId
                    and s.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<SupplierEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);

    Boolean existsByPhone(String phone);

    Boolean existsByEmail(String email);
}