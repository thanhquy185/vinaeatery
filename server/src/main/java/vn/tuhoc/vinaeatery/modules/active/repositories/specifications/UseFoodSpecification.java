package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class UseFoodSpecification {
        public static Specification<UseFoodEntity> filterUseFoods(UseFoodCriteria useFoodCriteria) {
                if (ValidationUtil.isNull(useFoodCriteria.getId())
                                && ValidationUtil.isNull(useFoodCriteria.getRestaurantId())
                                && ValidationUtil.isNull(useFoodCriteria.getFoodId())
                                && ValidationUtil.isNull(useFoodCriteria.getFoodName())
                                && ValidationUtil.isNull(useFoodCriteria.getCategoryFoodId())
                                && ValidationUtil.isNull(useFoodCriteria.getEmployeeId())
                                && ValidationUtil.isNull(useFoodCriteria.getStartAtStart())
                                && ValidationUtil.isNull(useFoodCriteria.getStartAtEnd())
                                && ValidationUtil.isNull(useFoodCriteria.getEndAtStart())
                                && ValidationUtil.isNull(useFoodCriteria.getEndAtEnd())
                                && ValidationUtil.isNull(useFoodCriteria.getStatus())
                                && ValidationUtil.isNull(useFoodCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(useFoodCriteria.getId())) {
                                useFoodCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(UseFoodEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(useFoodCriteria.getRestaurantId())) {
                                useFoodCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseFoodEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Food Id
                        if (ValidationUtil.nonNull(useFoodCriteria.getFoodId())) {
                                useFoodCriteria.getFoodId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(foodId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseFoodEntity_.FOOD)
                                                                                                .get("id"),
                                                                                Long.valueOf(foodId))));
                        }
                        // Food Name
                        if (ValidationUtil.nonNull(useFoodCriteria.getFoodName())) {
                                useFoodCriteria.getFoodName()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(foodName -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(
                                                                                                root.get(UseFoodEntity_.FOOD)
                                                                                                                .get("name")),
                                                                                "%" + foodName.toLowerCase() + "%")));
                        }
                        // Category Food Id
                        if (ValidationUtil.nonNull(useFoodCriteria.getCategoryFoodId())) {
                                useFoodCriteria.getCategoryFoodId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(categoryFoodId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseFoodEntity_.FOOD)
                                                                                                .get("categoryFood")
                                                                                                .get("id"),
                                                                                Long.valueOf(categoryFoodId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(useFoodCriteria.getEmployeeId())) {
                                useFoodCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseFoodEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Start At Start
                        if (ValidationUtil.nonNull(useFoodCriteria.getStartAtStart())) {
                                useFoodCriteria.getStartAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(startAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(UseFoodEntity_.START_AT),
                                                                                startAtStart)));
                        }
                        // Start At End
                        if (ValidationUtil.nonNull(useFoodCriteria.getStartAtEnd())) {
                                useFoodCriteria.getStartAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(startAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(UseFoodEntity_.START_AT),
                                                                                startAtEnd)));
                        }
                        // End At Start
                        if (ValidationUtil.nonNull(useFoodCriteria.getEndAtStart())) {
                                useFoodCriteria.getEndAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(endAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(UseFoodEntity_.END_AT),
                                                                                endAtStart)));
                        }
                        // End At End
                        if (ValidationUtil.nonNull(useFoodCriteria.getEndAtEnd())) {
                                useFoodCriteria.getEndAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(endAtEnd -> {
                                                        if (endAtEnd.equals("null")) {
                                                                predicates.add(
                                                                                criteriaBuilder.isNull(
                                                                                                root.get(UseFoodEntity_.END_AT)));
                                                        } else {
                                                                predicates.add(
                                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                                root.get(UseFoodEntity_.END_AT),
                                                                                                endAtEnd));
                                                        }
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(useFoodCriteria.getStatus())) {
                                useFoodCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        UseFoodStatusEnum useFoodStatusEnum = UseFoodStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(UseFoodEntity_.STATUS),
                                                                                        useFoodStatusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}