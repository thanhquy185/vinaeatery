package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryTable;
import vn.tuhoc.vinaeatery.domain.entity.CategoryTable_;

public class CategoryTableSpecification {
    // Methods
    public static Specification<CategoryTable> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryTable_.ID), id);
    }

    public static Specification<CategoryTable> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryTable_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<CategoryTable> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryTable_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryTable> surchargeTypeEqual(String surchargeType) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryTable_.SURCHARGE_TYPE), surchargeType);
    }

    public static Specification<CategoryTable> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryTable_.STATUS), status);
    }
}
