package vn.tuhoc.vinaeatery.modules.table.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity_;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class TableSpecification {
        public static Specification<TableEntity> filterTables(TableCriteria tableCriteria) {
                if (ValidationUtil.isNull(tableCriteria.getId())
                                && ValidationUtil.isNull(tableCriteria.getRestaurantId())
                                && ValidationUtil.isNull(tableCriteria.getName())
                                && ValidationUtil.isNull(tableCriteria.getFloorId())
                                && ValidationUtil.isNull(tableCriteria.getCategoryTableId())
                                && ValidationUtil.isNull(tableCriteria.getStatus())
                                && ValidationUtil.isNull(tableCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(tableCriteria.getId())) {
                                tableCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(TableEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(tableCriteria.getRestaurantId())) {
                                tableCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(TableEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Floor Id
                        if (ValidationUtil.nonNull(tableCriteria.getFloorId())) {
                                tableCriteria.getFloorId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(floorId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(TableEntity_.FLOOR).get("id"),
                                                                                Long.valueOf(floorId))));
                        }
                        // Category Table Id
                        if (ValidationUtil.nonNull(tableCriteria.getCategoryTableId())) {
                                tableCriteria.getCategoryTableId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(categoryTableId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(TableEntity_.CATEGORY_TABLE)
                                                                                                .get("id"),
                                                                                Long.valueOf(categoryTableId))));
                        }
                        // Name
                        if (ValidationUtil.nonNull(tableCriteria.getName())) {
                                tableCriteria.getName()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(name -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                TableEntity_.NAME)),
                                                                                "%" + name.toLowerCase() + "%")));
                        }
                        // Status
                        if (ValidationUtil.nonNull(tableCriteria.getStatus())) {
                                tableCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        CommonStatusEnum statusEnum = CommonStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(TableEntity_.STATUS),
                                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}
