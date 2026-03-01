package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish;
import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish_;

public class CategoryRewardPunishSpecification {
    // Methods
    public static Specification<CategoryRewardPunish> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryRewardPunish_.ID), id);
    }

    public static Specification<CategoryRewardPunish> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryRewardPunish_.RESTAURANT_ID),
                restaurantId);
    }

    public static Specification<CategoryRewardPunish> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryRewardPunish_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryRewardPunish> handleEqual(String handle) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryRewardPunish_.HANDLE), handle);
    }

    public static Specification<CategoryRewardPunish> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryRewardPunish_.STATUS), status);
    }
}
