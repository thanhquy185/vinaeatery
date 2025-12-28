package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.RoleDetail;
import vn.tuhoc.vinaeatery.domain.entity.RoleDetailId;

@Repository
public interface RoleDetailRepository
        extends JpaRepository<RoleDetail, RoleDetailId>, JpaSpecificationExecutor<RoleDetail> {
    // Methods
    RoleDetail findOneById(RoleDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.role_details WHERE role_id = :role_id", nativeQuery = true)
    List<RoleDetail> findAllByRoleId(@Param("role_id") Integer roleId);

    void deleteById(RoleDetailId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.role_details WHERE role_id = :role_id", nativeQuery = true)
    void deleteAllByRoleId(@Param("role_id") Integer roleId);
}