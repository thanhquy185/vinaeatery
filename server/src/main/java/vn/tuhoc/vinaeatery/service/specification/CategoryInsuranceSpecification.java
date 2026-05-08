package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance;
import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance_;

public class CategoryInsuranceSpecification {
    // Methods
    public static Specification<CategoryInsurance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryInsurance_.ID), id);
    }

    public static Specification<CategoryInsurance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryInsurance_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<CategoryInsurance> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryInsurance_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryInsurance> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryInsurance_.STATUS), status);
    }
}
