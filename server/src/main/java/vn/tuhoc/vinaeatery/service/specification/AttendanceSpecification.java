package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Attendance;
import vn.tuhoc.vinaeatery.domain.entity.Attendance_;

public class AttendanceSpecification {
        // Methods
    public static Specification<Attendance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.ID), id);
    }

    public static Specification<Attendance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Attendance> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.EMPLOYEE_ID), employeeId);
    }

    public static Specification<Attendance> shiftIdEqual(String shiftId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.SHIFT_ID), shiftId);
    }

    public static Specification<Attendance> leaveEqual(String leave) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.LEAVE), leave);
    }

    public static Specification<Attendance> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Attendance_.STATUS), status);
    }
}
