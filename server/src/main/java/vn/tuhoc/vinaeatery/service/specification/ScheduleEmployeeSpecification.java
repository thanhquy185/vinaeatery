package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee_;

public class ScheduleEmployeeSpecification {
    // Methods
    public static Specification<ScheduleEmployee> scheduleIdEqual(String scheduleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(ScheduleEmployee_.ID).get("scheduleId"), scheduleId);
    }

    public static Specification<ScheduleEmployee> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(ScheduleEmployee_.ID).get("employeeId"),
                employeeId);
    }
}