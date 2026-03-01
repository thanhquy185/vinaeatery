package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId;

@Repository
public interface ScheduleShiftRepository
        extends JpaRepository<ScheduleShift, ScheduleShiftId>, JpaSpecificationExecutor<ScheduleShift> {
    // Methods
    ScheduleShift findOneById(ScheduleShiftId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.schedule_shifts WHERE schedule_id = :schedule_id", nativeQuery = true)
    List<ScheduleShift> findAllByScheduleId(@Param("schedule_id") Integer scheduleId);

    void deleteById(ScheduleShiftId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.schedule_shifts WHERE schedule_id = :schedule_id", nativeQuery = true)
    void deleteAllByScheduleId(@Param("schedule_id") Integer scheduleId);
}