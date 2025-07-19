package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.CategoryFood;
import vn.tuhoc.vinaeatery.domain.CategoryFood_;

public class CategoryFoodSpecification {
        // Methods
    public static Specification<CategoryFood> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryFood_.ID), id);
    }

    public static Specification<CategoryFood> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryFood_.NAME), "%" + name + "%");
    }

    public static Specification<CategoryFood> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryFood_.STATUS), status);
    }
}
