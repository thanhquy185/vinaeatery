package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity_;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class CategoryIngredientSpecification {
    public static Specification<CategoryIngredientEntity> filterCategoryIngredients(
            CategoryIngredientCriteria categoryIngredientCriteria) {
        if (ValidationUtil.isNull(categoryIngredientCriteria.getId())
                && ValidationUtil.isNull(categoryIngredientCriteria.getRestaurantId())
                && ValidationUtil.isNull(categoryIngredientCriteria.getName())
                && ValidationUtil.isNull(categoryIngredientCriteria.getStatus())
                && ValidationUtil.isNull(categoryIngredientCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(categoryIngredientCriteria.getId())) {
                categoryIngredientCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(CategoryIngredientEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(categoryIngredientCriteria.getRestaurantId())) {
                categoryIngredientCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(CategoryIngredientEntity_.RESTAURANT)
                                                .get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Name
            if (ValidationUtil.nonNull(categoryIngredientCriteria.getName())) {
                categoryIngredientCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                CategoryIngredientEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(categoryIngredientCriteria.getStatus())) {
                categoryIngredientCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum
                                    .fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(
                                            CategoryIngredientEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
