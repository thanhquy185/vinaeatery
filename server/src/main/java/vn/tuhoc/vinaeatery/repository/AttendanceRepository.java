package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer>, JpaSpecificationExecutor<Attendance> {
    // Methods
    Attendance findOneById(Integer id);

    List<Attendance> findAllByRestaurantId(Integer restaurantId);

    List<Attendance> findAllByEmployeeId(Integer employeeId);

    void deleteById(Integer id);
}