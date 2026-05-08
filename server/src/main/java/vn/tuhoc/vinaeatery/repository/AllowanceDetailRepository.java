package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId;

@Repository
public interface AllowanceDetailRepository
        extends JpaRepository<AllowanceDetail, AllowanceDetailId>, JpaSpecificationExecutor<AllowanceDetail> {
    // Methods
    AllowanceDetail findOneById(AllowanceDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.allowance_details WHERE allowance_id = :allowance_id", nativeQuery = true)
    List<AllowanceDetail> findAllByAllowanceId(@Param("allowance_id") Integer allowanceId);

    void deleteById(AllowanceDetailId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.allowance_details WHERE allowance_id = :allowance_id", nativeQuery = true)
    void deleteAllByAllowanceId(@Param("allowance_id") Integer allowanceId);
}