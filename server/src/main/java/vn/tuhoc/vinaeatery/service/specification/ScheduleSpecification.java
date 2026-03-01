package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Schedule;
import vn.tuhoc.vinaeatery.domain.entity.Schedule_;

public class ScheduleSpecification {
    // Methods
    public static Specification<Schedule> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Schedule_.ID), id);
    }

    public static Specification<Schedule> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Schedule_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Schedule> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Schedule_.NAME), "%" + name + "%");
    }

    public static Specification<Schedule> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Schedule_.STATUS), status);
    }
}