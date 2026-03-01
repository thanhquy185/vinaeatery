package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Shift;
import vn.tuhoc.vinaeatery.domain.entity.Shift_;

public class ShiftSpecification {
    // Methods
    public static Specification<Shift> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Shift_.ID), id);
    }

    public static Specification<Shift> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Shift_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Shift> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Shift_.NAME), "%" + name + "%");
    }

    public static Specification<Shift> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Shift_.STATUS), status);
    }
}