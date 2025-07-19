package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.Ingredient_;

public class IngredientSpecification {
    // Methods
    public static Specification<Ingredient> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Ingredient_.ID), id);
    }

    public static Specification<Ingredient> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Ingredient_.NAME), "%" + name + "%");
    }

    public static Specification<Ingredient> categoryIngredientIdEqual(String categoryIngredientId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Ingredient_.CATEGORY_INGREDIENT_ID),
                categoryIngredientId);
    }

    public static Specification<Ingredient> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Ingredient_.STATUS), status);
    }
}