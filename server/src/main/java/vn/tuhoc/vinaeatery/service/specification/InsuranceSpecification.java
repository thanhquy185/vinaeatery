package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Insurance;
import vn.tuhoc.vinaeatery.domain.entity.Insurance_;

public class InsuranceSpecification {
    // Methods
    public static Specification<Insurance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Insurance_.ID), id);
    }

    public static Specification<Insurance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Insurance_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Insurance> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Insurance_.NAME), "%" + name + "%");
    }

    public static Specification<Insurance> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Insurance_.STATUS), status);
    }
}