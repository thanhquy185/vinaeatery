package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity_;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class CategoryFoodSpecification {
    public static Specification<CategoryFoodEntity> filterCategoryFoods(
            CategoryFoodCriteria categoryFoodCriteria) {
        if (ValidationUtil.isNull(categoryFoodCriteria.getId())
                && ValidationUtil.isNull(categoryFoodCriteria.getRestaurantId())
                && ValidationUtil.isNull(categoryFoodCriteria.getName())
                && ValidationUtil.isNull(categoryFoodCriteria.getStatus())
                && ValidationUtil.isNull(categoryFoodCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(categoryFoodCriteria.getId())) {
                categoryFoodCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(CategoryFoodEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(categoryFoodCriteria.getRestaurantId())) {
                categoryFoodCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(CategoryFoodEntity_.RESTAURANT)
                                                .get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Name
            if (ValidationUtil.nonNull(categoryFoodCriteria.getName())) {
                categoryFoodCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                CategoryFoodEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(categoryFoodCriteria.getStatus())) {
                categoryFoodCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum
                                    .fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(
                                            CategoryFoodEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
