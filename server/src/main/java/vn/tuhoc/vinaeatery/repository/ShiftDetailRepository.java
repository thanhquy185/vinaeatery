package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId;

@Repository
public interface ShiftDetailRepository
        extends JpaRepository<ShiftDetail, ShiftDetailId>, JpaSpecificationExecutor<ShiftDetail> {
    // Methods
    ShiftDetail findOneById(ShiftDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.shift_details WHERE shift_id = :shift_id", nativeQuery = true)
    List<ShiftDetail> findAllByShiftId(@Param("shift_id") Integer shiftId);

    void deleteById(ShiftDetailId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.shift_details WHERE shift_id = :shift_id", nativeQuery = true)
    void deleteAllByShiftId(@Param("shift_id") Integer shiftId);
}