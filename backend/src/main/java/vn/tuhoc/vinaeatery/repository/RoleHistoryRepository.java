package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.RoleHistory;
import vn.tuhoc.vinaeatery.domain.RoleHistoryId;

@Repository
public interface RoleHistoryRepository
        extends JpaRepository<RoleHistory, RoleHistoryId>, JpaSpecificationExecutor<RoleHistory> {
    // Methods
    RoleHistory findOneById(RoleHistoryId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.role_histories WHERE employee_id = :employee_id AND date_end IS NULL", nativeQuery = true)
    RoleHistory findNewByEmployeeId(@Param("employee_id") Integer employeeId);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.role_histories WHERE role_id = :role_id AND date_end IS NULL", nativeQuery = true)
    List<RoleHistory> findAllNewByRoleId(@Param("role_id") Integer roleId);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.role_histories WHERE employee_id = :employee_id", nativeQuery = true)
    List<RoleHistory> findAllByEmployeeId(@Param("employee_id") Integer employeeId);

    void deleteById(RoleHistoryId id);
}