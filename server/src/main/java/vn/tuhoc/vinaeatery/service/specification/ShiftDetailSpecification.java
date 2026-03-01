package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail_;

public class ShiftDetailSpecification {
    // Methods
    public static Specification<ShiftDetail> shiftIdEqual(String shiftId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(ShiftDetail_.ID).get("shiftId"), shiftId);
    }

    public static Specification<ShiftDetail> dayOfWeekEqual(String dayOfWeek) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(ShiftDetail_.ID).get("dayOfWeek"),
                dayOfWeek);
    }

    public static Specification<ShiftDetail> timeStartEqual(String timeStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(ShiftDetail_.ID).get("timeStart"),
                timeStart);
    }

    public static Specification<ShiftDetail> timeEndEqual(String timeEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(ShiftDetail_.ID).get("timeEnd"),
                timeEnd);
    }
}