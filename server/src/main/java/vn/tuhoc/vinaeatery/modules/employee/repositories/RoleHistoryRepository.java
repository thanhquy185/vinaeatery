package vn.tuhoc.vinaeatery.modules.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryIdEntity;

public interface RoleHistoryRepository
        extends JpaRepository<RoleHistoryEntity, RoleHistoryIdEntity>, JpaSpecificationExecutor<RoleHistoryEntity> {
    @Query("""
                select count(rh) > 0
                from RoleHistoryEntity rh
                where rh.role.id = :roleId
                  and rh.dateEnd IS NULL
            """)
    Boolean existsByRoleIdAndDateEndIsNull(@Param("roleId") Integer roleId);
}