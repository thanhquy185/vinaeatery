package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity_;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class IngredientSpecification {
    public static Specification<IngredientEntity> filterIngredients(IngredientCriteria ingredientCriteria) {
        if (ValidationUtil.isNull(ingredientCriteria.getId())
                && ValidationUtil.isNull(ingredientCriteria.getRestaurantId())
                && ValidationUtil.isNull(ingredientCriteria.getName())
                && ValidationUtil.isNull(ingredientCriteria.getCategoryIngredientId())
                && ValidationUtil.isNull(ingredientCriteria.getStatus())
                && ValidationUtil.isNull(ingredientCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(ingredientCriteria.getId())) {
                ingredientCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(IngredientEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(ingredientCriteria.getRestaurantId())) {
                ingredientCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(IngredientEntity_.RESTAURANT)
                                                .get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Category Ingredient Id
            if (ValidationUtil.nonNull(ingredientCriteria.getCategoryIngredientId())) {
                ingredientCriteria.getCategoryIngredientId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(categoryIngredientId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(IngredientEntity_.CATEGORY_INGREDIENT)
                                                .get("id"),
                                        Long.valueOf(categoryIngredientId))));
            }
            // Name
            if (ValidationUtil.nonNull(ingredientCriteria.getName())) {
                ingredientCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                IngredientEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(ingredientCriteria.getStatus())) {
                ingredientCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum
                                    .fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(
                                            root.get(IngredientEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}