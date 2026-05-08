package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance_;

public class CategoryAllowanceSpecification {
    // Methods
    public static Specification<CategoryAllowance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryAllowance_.ID), id);
    }

    public static Specification<CategoryAllowance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryAllowance_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<CategoryAllowance> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryAllowance_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryAllowance> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryAllowance_.STATUS), status);
    }
}
