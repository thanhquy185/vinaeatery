package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeId;

@Repository
public interface ScheduleEmployeeRepository
        extends JpaRepository<ScheduleEmployee, ScheduleEmployeeId>, JpaSpecificationExecutor<ScheduleEmployee> {
    // Methods
    ScheduleEmployee findOneById(ScheduleEmployeeId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.schedule_employees WHERE schedule_id = :schedule_id", nativeQuery = true)
    List<ScheduleEmployee> findAllByScheduleId(@Param("schedule_id") Integer scheduleId);

    void deleteById(ScheduleEmployeeId id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vinaeatery.schedule_employees WHERE schedule_id = :schedule_id", nativeQuery = true)
    void deleteAllByScheduleId(@Param("schedule_id") Integer scheduleId);
}