package vn.tuhoc.vinaeatery.modules.restaurant.repositories;

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

import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.graphs.RestaurantEntityGraph;

public interface RestaurantRepository
                extends JpaRepository<RestaurantEntity, Integer>, JpaSpecificationExecutor<RestaurantEntity> {

        @EntityGraph(value = RestaurantEntityGraph.HALF)
        @Query("""
                                select distinct r
                                from RestaurantEntity r
                                left join fetch r.restaurantImages ri
                                where r.id = :id
                        """)
        Optional<RestaurantEntity> findOneById(@Param("id") Integer id);

        @Query("""
                                select distinct r
                                from RestaurantEntity r
                                where r.id = :id
                        """)
        Optional<RestaurantEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = RestaurantEntityGraph.HALF)
        Page<RestaurantEntity> findAll(Specification<RestaurantEntity> specification, Pageable pageable);

        @EntityGraph(value = RestaurantEntityGraph.HALF)
        @Query("""
                                select distinct r
                                from RestaurantEntity r
                                left join fetch r.restaurantImages ri
                                where r.manager.id = :managerId
                        """)
        List<RestaurantEntity> findAllByManagerId(@Param("managerId") Integer managerId);

        @EntityGraph(value = RestaurantEntityGraph.HALF)
        @Query("""
                            select r
                            from RestaurantEntity r
                            where r.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<RestaurantEntity> findAllCrud();

        Boolean existsByPhone(String phone);

        Boolean existsByEmail(String email);

        @EntityGraph(value = RestaurantEntityGraph.HALF)
        @Query("""
                            select count(r) > 0
                            from RestaurantEntity r
                            where r.manager.id = :managerId
                              and r.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        Boolean existsByManagerIdAndStatusIsActive(@Param("managerId") Integer managerId);
}