package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Food;
import vn.tuhoc.vinaeatery.domain.entity.Food_;

public class FoodSpecification {
    // Methods
    public static Specification<Food> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Food_.ID), id);
    }

    public static Specification<Food> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Food_.RESTAURANT_ID), restaurantId);
    } 

    public static Specification<Food> categoryFoodIdEqual(String categoryFoodId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Food_.CATEGORY_FOOD_ID),
                categoryFoodId);
    }

    public static Specification<Food> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Food_.NAME), "%" + name + "%");
    }

    public static Specification<Food> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Food_.STATUS), status);
    }
}
