package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Allowance;
import vn.tuhoc.vinaeatery.domain.entity.Allowance_;

public class AllowanceSpecification {
    // Methods
    public static Specification<Allowance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Allowance_.ID), id);
    }

    public static Specification<Allowance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Allowance_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Allowance> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Allowance_.NAME), "%" + name + "%");
    }

    public static Specification<Allowance> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Allowance_.STATUS), status);
    }
}