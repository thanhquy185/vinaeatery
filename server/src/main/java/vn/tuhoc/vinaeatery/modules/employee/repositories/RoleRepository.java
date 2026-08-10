package vn.tuhoc.vinaeatery.modules.employee.repositories;

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

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.graphs.RoleEntityGraph;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer>, JpaSpecificationExecutor<RoleEntity> {
        @Query("""
                                select distinct r
                                from RoleEntity r
                                where r.id = :id
                        """)
        Optional<RoleEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = RoleEntityGraph.FULL)
        @Query("""
                                select distinct r
                                from RoleEntity r
                                where r.id = :id
                        """)
        Optional<RoleEntity> findOneById(@Param("id") Integer id);

        Page<RoleEntity> findAll(Specification<RoleEntity> specification, Pageable pageable);

        @Query("""
                                select r
                                from RoleEntity r
                                where r.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<RoleEntity> findAllCrud();

        @Query("""
                                select r
                                from RoleEntity r
                                where r.restaurant.id = :restaurantId
                                        and r.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<RoleEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}