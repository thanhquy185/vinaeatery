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

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.graphs.PermissionEntityGraph;

public interface PermissionRepository
                extends JpaRepository<PermissionEntity, Integer>, JpaSpecificationExecutor<PermissionEntity> {
        @Query("""
                                select distinct p
                                from PermissionEntity p
                                where p.id = :id
                        """)
        Optional<PermissionEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = PermissionEntityGraph.HALF)
        @Query("""
                                select distinct p
                                from PermissionEntity p
                                left join fetch p.permissionDetails pd
                                left join fetch pd.function
                                where p.id = :id
                        """)
        Optional<PermissionEntity> findOneById(@Param("id") Integer id);

        Page<PermissionEntity> findAll(Specification<PermissionEntity> specification, Pageable pageable);

        @Query("""
                                select p
                                from PermissionEntity p
                                where p.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<PermissionEntity> findAllCrud();

        @Query("""
                                select p
                                from PermissionEntity p
                                where p.restaurant.id = :restaurantId
                                        and p.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<PermissionEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}