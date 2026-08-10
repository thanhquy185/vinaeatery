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

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.graphs.EmployeeEntityGraph;

public interface EmployeeRepository
                extends JpaRepository<EmployeeEntity, Integer>, JpaSpecificationExecutor<EmployeeEntity> {
        @Query("""
                                select distinct e
                                from EmployeeEntity e
                                where e.id = :id
                        """)
        Optional<EmployeeEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = EmployeeEntityGraph.HALF)
        @Query("""
                                select distinct e
                                from EmployeeEntity e
                                left join fetch e.roleHistories rh
                                left join fetch rh.role
                                where e.id = :id
                        """)
        Optional<EmployeeEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = EmployeeEntityGraph.HALF)
        @Query("""
                                select distinct e
                                from EmployeeEntity e
                                left join fetch e.permission p
                                left join fetch p.permissionDetails pd
                                left join fetch pd.function
                                where e.user.id = :userId
                        """)
        Optional<EmployeeEntity> findOneByUserId(@Param("userId") Integer userId);

        @EntityGraph(value = EmployeeEntityGraph.ONLY_USER_AND_ROLE_AND_PERMISSION)
        Page<EmployeeEntity> findAll(Specification<EmployeeEntity> specification, Pageable pageable);

        @EntityGraph(value = EmployeeEntityGraph.ONLY_USER_AND_ROLE_AND_PERMISSION)
        @Query("""
                            select e
                            from EmployeeEntity e
                            where e.status = vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum.ACTIVE
                        """)
        List<EmployeeEntity> findAllCrud();

        @EntityGraph(value = EmployeeEntityGraph.ONLY_USER_AND_ROLE_AND_PERMISSION)
        @Query("""
                            select e
                            from EmployeeEntity e
                            where e.restaurant.id = :restaurantId
                                and e.status = vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum.ACTIVE
                        """)
        List<EmployeeEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);

        Boolean existsByPhone(String phone);

        Boolean existsByEmail(String email);

        @Query("""
                            select count(e) > 0
                            from EmployeeEntity e
                            where e.permission.id = :permissionId
                              and e.status = vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum.ACTIVE
                        """)
        Boolean existsByPermissionIdAndStatusActive(@Param("permissionId") Integer permissionId);
}