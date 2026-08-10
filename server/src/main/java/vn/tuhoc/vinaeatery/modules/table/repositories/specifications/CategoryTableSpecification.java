package vn.tuhoc.vinaeatery.modules.table.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity_;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class CategoryTableSpecification {
        public static Specification<CategoryTableEntity> filterCategoryTables(
                        CategoryTableCriteria categoryTableCriteria) {
                if (ValidationUtil.isNull(categoryTableCriteria.getId())
                                && ValidationUtil.isNull(categoryTableCriteria.getRestaurantId())
                                && ValidationUtil.isNull(categoryTableCriteria.getName())
                                && ValidationUtil.isNull(categoryTableCriteria.getSurchargeType())
                                && ValidationUtil.isNull(categoryTableCriteria.getStatus())
                                && ValidationUtil.isNull(categoryTableCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(categoryTableCriteria.getId())) {
                                categoryTableCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(CategoryTableEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(categoryTableCriteria.getRestaurantId())) {
                                categoryTableCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(CategoryTableEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Name
                        if (ValidationUtil.nonNull(categoryTableCriteria.getName())) {
                                categoryTableCriteria.getName()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(name -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                CategoryTableEntity_.NAME)),
                                                                                "%" + name.toLowerCase() + "%")));
                        }
                        // Surcharge Type
                        if (ValidationUtil.nonNull(categoryTableCriteria.getSurchargeType())) {
                                categoryTableCriteria.getSurchargeType()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(surchargeType -> {
                                                        CategoryTableSurchargeTypeEnum surchargeTypeEnum = CategoryTableSurchargeTypeEnum
                                                                        .fromDescription(surchargeType);
                                                        predicates.add(criteriaBuilder.equal(
                                                                        root.get(CategoryTableEntity_.SURCHARGE_TYPE),
                                                                        surchargeTypeEnum.getValue()));
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(categoryTableCriteria.getStatus())) {
                                categoryTableCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        CommonStatusEnum statusEnum = CommonStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root.get(
                                                                                        CategoryTableEntity_.STATUS),
                                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}
