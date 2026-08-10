package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity_;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class FoodSpecification {
    public static Specification<FoodEntity> filterFoods(FoodCriteria foodCriteria) {
        if (ValidationUtil.isNull(foodCriteria.getId())
                && ValidationUtil.isNull(foodCriteria.getRestaurantId())
                && ValidationUtil.isNull(foodCriteria.getName())
                && ValidationUtil.isNull(foodCriteria.getCategoryFoodId())
                && ValidationUtil.isNull(foodCriteria.getStatus())
                && ValidationUtil.isNull(foodCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(foodCriteria.getId())) {
                foodCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(FoodEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(foodCriteria.getRestaurantId())) {
                foodCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(FoodEntity_.RESTAURANT)
                                                .get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Category Food Id
            if (ValidationUtil.nonNull(foodCriteria.getCategoryFoodId())) {
                foodCriteria.getCategoryFoodId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(categoryFoodId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(FoodEntity_.CATEGORY_FOOD)
                                                .get("id"),
                                        Long.valueOf(categoryFoodId))));
            }
            // Name
            if (ValidationUtil.nonNull(foodCriteria.getName())) {
                foodCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                FoodEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(foodCriteria.getStatus())) {
                foodCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            FoodStatusEnum statusEnum = FoodStatusEnum
                                    .fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(
                                            root.get(FoodEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
