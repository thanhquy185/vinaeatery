package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId;

@Repository
public interface InsuranceDetailRepository
        extends JpaRepository<InsuranceDetail, InsuranceDetailId>, JpaSpecificationExecutor<InsuranceDetail> {
    // Methods
    InsuranceDetail findOneById(InsuranceDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.insurance_details WHERE insurance_id = :insurance_id", nativeQuery = true)
    List<InsuranceDetail> findAllByInsuranceId(@Param("insurance_id") Integer insuranceId);

    void deleteById(InsuranceDetailId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.insurance_details WHERE insurance_id = :insurance_id", nativeQuery = true)
    void deleteAllByInsuranceId(@Param("insurance_id") Integer insuranceId);
}