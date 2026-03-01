package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId;

@Repository
public interface PermissionDetailRepository
        extends JpaRepository<PermissionDetail, PermissionDetailId>, JpaSpecificationExecutor<PermissionDetail> {
    // Methods
    PermissionDetail findOneById(PermissionDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.permission_details WHERE permission_id = :permission_id", nativeQuery = true)
    List<PermissionDetail> findAllByPermissionId(@Param("permission_id") Integer permissionId);

    void deleteById(PermissionDetailId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.permission_details WHERE permission_id = :permission_id", nativeQuery = true)
    void deleteAllByPermissionId(@Param("permission_id") Integer permissionId);
}