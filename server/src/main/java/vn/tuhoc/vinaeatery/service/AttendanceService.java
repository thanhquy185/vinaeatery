package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.AttendanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.AttendanceDTO;
import vn.tuhoc.vinaeatery.domain.entity.Attendance_;
import vn.tuhoc.vinaeatery.domain.entity.Attendance;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceLeaveEnum;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.AttendanceRepository;
import vn.tuhoc.vinaeatery.service.specification.AttendanceSpecification;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    // Properties
    private final AttendanceRepository attendanceRepository;

    // Methods
    public Attendance getOneById(Integer id) {
        return this.attendanceRepository.findOneById(id);
    }

    public AttendanceDTO getOneFormatById(Integer id) {
        AttendanceDTO attendanceDTO = new AttendanceDTO();
        Attendance attendance = getOneById(id);
        if (attendance != null) {
            attendanceDTO.setId(attendance.getId());
            attendanceDTO.setRestaurantId(attendance.getRestaurantId());
            attendanceDTO.setEmployeeId(attendance.getEmployeeId());
            attendanceDTO.setShiftId(attendance.getShiftId());
            attendanceDTO.setDate(attendance.getDate());
            attendanceDTO.setCheckIn(attendance.getCheckIn());
            attendanceDTO.setCheckOut(attendance.getCheckOut());
            attendanceDTO.setLeave(attendance.getLeave());
            attendanceDTO.setStatus(attendance.getStatus());
        }

        return attendanceDTO;
    }

    public List<Attendance> getAll() {
        return this.attendanceRepository.findAll();
    }

    public List<Attendance> getAll(AttendanceCriteria attendanceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (attendanceCriteria.getSort() != null && attendanceCriteria.getSort().isPresent()) {
            String sortStr = attendanceCriteria.getSort().get();
            switch (sortStr) {
                case "Mã điểm danh tăng dần" -> sort = Sort.by(Attendance_.ID).ascending();
                case "Mã điểm danh giảm dần" -> sort = Sort.by(Attendance_.ID).descending();
                case "Ngày điểm danh tăng dần" -> sort = Sort.by(Attendance_.DATE).ascending();
                case "Ngày điểm danh giảm dần" -> sort = Sort.by(Attendance_.DATE).descending();
            }
        }

        //
        if (attendanceCriteria.getId() == null
                && attendanceCriteria.getRestaurantId() == null
                && attendanceCriteria.getEmployeeId() == null
                && attendanceCriteria.getShiftId() == null
                && attendanceCriteria.getLeave() == null
                && attendanceCriteria.getStatus() == null
                && attendanceCriteria.getSort() == null) {
            return this.attendanceRepository.findAll(sort);
        }
        //
        Specification<Attendance> combinedSpec = Specification.where(null);
        if (attendanceCriteria.getId() != null && attendanceCriteria.getId().isPresent()) {
            if (attendanceCriteria.getId().get().matches("\\d+")) {
                Specification<Attendance> currentSpec = AttendanceSpecification
                        .idEqual(attendanceCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (attendanceCriteria.getRestaurantId() != null && attendanceCriteria.getRestaurantId().isPresent()) {
            if (attendanceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Attendance> currentSpec = AttendanceSpecification
                        .restaurantIdEqual(attendanceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (attendanceCriteria.getEmployeeId() != null && attendanceCriteria.getEmployeeId().isPresent()) {
            if (attendanceCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<Attendance> currentSpec = AttendanceSpecification
                        .employeeIdEqual(attendanceCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (attendanceCriteria.getShiftId() != null && attendanceCriteria.getShiftId().isPresent()) {
            if (attendanceCriteria.getShiftId().get().matches("\\d+")) {
                Specification<Attendance> currentSpec = AttendanceSpecification
                        .shiftIdEqual(attendanceCriteria.getShiftId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (attendanceCriteria.getLeave() != null && attendanceCriteria.getLeave().isPresent()) {
            String leaveString = attendanceCriteria.getLeave().get();
            String leaveStringValue = null;
            for (AttendanceLeaveEnum attendanceLeave : AttendanceLeaveEnum.values()) {
                if (attendanceLeave.getDescription().equals(leaveString)) {
                    leaveStringValue = attendanceLeave.getValue();
                    break;
                }
            }
            Specification<Attendance> currentSpec = AttendanceSpecification.leaveEqual(leaveStringValue);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (attendanceCriteria.getStatus() != null && attendanceCriteria.getStatus().isPresent()) {
            String statusString = attendanceCriteria.getStatus().get();
            Integer statusInteger = null;
            for (AttendanceStatusEnum attendanceStatus : AttendanceStatusEnum.values()) {
                if (attendanceStatus.getDescription().equals(statusString)) {
                    statusInteger = attendanceStatus.getValue();
                    break;
                }
            }
            Specification<Attendance> currentSpec = AttendanceSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.attendanceRepository.findAll(combinedSpec, sort);
    }

    public List<AttendanceDTO> getAllFormat(AttendanceCriteria attendanceCriteria) {
        List<AttendanceDTO> listFormat = new ArrayList<>();
        for (Attendance attendance : getAll(attendanceCriteria)) {
            listFormat.add(getOneFormatById(attendance.getId()));
        }

        return listFormat;
    }

    public Attendance upsert(Attendance attendance) {
        return this.attendanceRepository.save(attendance);
    }

    public void delete(Integer id) {
        this.attendanceRepository.deleteById(id);
    }

    public void lock(Attendance attendance) {
        this.attendanceRepository.save(attendance);
    }
}
