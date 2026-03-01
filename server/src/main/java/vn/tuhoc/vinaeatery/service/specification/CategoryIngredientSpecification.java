package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient_;

public class CategoryIngredientSpecification {
    // Methods
    public static Specification<CategoryIngredient> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryIngredient_.ID), id);
    }

    public static Specification<CategoryIngredient> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryIngredient_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<CategoryIngredient> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryIngredient_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryIngredient> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryIngredient_.STATUS), status);
    }
}
