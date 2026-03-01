package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift_;

public class ScheduleShiftSpecification {
    // Methods
    public static Specification<ScheduleShift> scheduleIdEqual(String scheduleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(ScheduleShift_.ID).get("scheduleId"), scheduleId);
    }

    public static Specification<ScheduleShift> shiftIdEqual(String shiftId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(ScheduleShift_.ID).get("shiftId"),
                shiftId);
    }
}