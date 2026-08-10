package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity_;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class OrderSheetSpecification {
        public static Specification<OrderSheetEntity> filterOrderSheets(OrderSheetCriteria orderSheetCriteria) {
                return (root, query, criteriaBuilder) -> {
                        if (!Long.class.equals(query.getResultType())
                                        && !long.class.equals(query.getResultType())) {

                                Fetch<OrderSheetEntity, UseTableEntity> useTable = root
                                                .fetch(OrderSheetEntity_.USE_TABLE, JoinType.INNER);

                                Fetch<UseTableEntity, TableEntity> table = useTable.fetch(UseTableEntity_.TABLE,
                                                JoinType.INNER);

                                table.fetch(TableEntity_.FLOOR, JoinType.LEFT);
                                table.fetch(TableEntity_.CATEGORY_TABLE, JoinType.LEFT);

                                query.distinct(true);
                        }

                        if (ValidationUtil.isNull(orderSheetCriteria.getId())
                                        && ValidationUtil.isNull(orderSheetCriteria.getRestaurantId())
                                        && ValidationUtil.isNull(orderSheetCriteria.getTableId())
                                        && ValidationUtil.isNull(orderSheetCriteria.getTableName())
                                        && ValidationUtil.isNull(orderSheetCriteria.getFloorId())
                                        && ValidationUtil.isNull(orderSheetCriteria.getEmployeeId())
                                        && ValidationUtil.isNull(orderSheetCriteria.getCreateAtStart())
                                        && ValidationUtil.isNull(orderSheetCriteria.getCreateAtEnd())
                                        && ValidationUtil.isNull(orderSheetCriteria.getServiceAtStart())
                                        && ValidationUtil.isNull(orderSheetCriteria.getServiceAtEnd())
                                        && ValidationUtil.isNull(orderSheetCriteria.getCancelAtStart())
                                        && ValidationUtil.isNull(orderSheetCriteria.getCancelAtEnd())
                                        && ValidationUtil.isNull(orderSheetCriteria.getStatus())
                                        && ValidationUtil.isNull(orderSheetCriteria.getSort())) {
                                return null;
                        }

                        List<Predicate> predicates = new ArrayList<>();
                        // Id
                        if (ValidationUtil.nonNull(orderSheetCriteria.getId())) {
                                orderSheetCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(OrderSheetEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(orderSheetCriteria.getRestaurantId())) {
                                orderSheetCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(OrderSheetEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Table Id
                        if (ValidationUtil.nonNull(orderSheetCriteria.getTableId())) {
                                orderSheetCriteria.getTableId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(tableId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(OrderSheetEntity_.USE_TABLE)
                                                                                                .get("table").get("id"),
                                                                                Long.valueOf(tableId))));
                        }
                        // Table Name
                        if (ValidationUtil.nonNull(orderSheetCriteria.getTableName())) {
                                orderSheetCriteria.getTableName()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(tableName -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(OrderSheetEntity_.USE_TABLE)
                                                                                                .get("table")
                                                                                                .get("name"),
                                                                                Long.valueOf(tableName))));
                        }
                        // Floor Id
                        if (ValidationUtil.nonNull(orderSheetCriteria.getFloorId())) {
                                orderSheetCriteria.getFloorId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(floorId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(OrderSheetEntity_.USE_TABLE)
                                                                                                .get("table")
                                                                                                .get("floor").get("id"),
                                                                                Long.valueOf(floorId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(orderSheetCriteria.getEmployeeId())) {
                                orderSheetCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(OrderSheetEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Create At Start
                        if (ValidationUtil.nonNull(orderSheetCriteria.getCreateAtStart())) {
                                orderSheetCriteria.getCreateAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.CREATE_AT),
                                                                                createAtStart)));
                        }
                        // Create At End
                        if (ValidationUtil.nonNull(orderSheetCriteria.getCreateAtEnd())) {
                                orderSheetCriteria.getCreateAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.CREATE_AT),
                                                                                createAtEnd)));
                        }
                        // Service At Start
                        if (ValidationUtil.nonNull(orderSheetCriteria.getServiceAtStart())) {
                                orderSheetCriteria.getServiceAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(serviceAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.SERVICE_AT),
                                                                                serviceAtStart)));
                        }
                        // Service At End
                        if (ValidationUtil.nonNull(orderSheetCriteria.getServiceAtEnd())) {
                                orderSheetCriteria.getServiceAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(serviceAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.SERVICE_AT),
                                                                                serviceAtEnd)));
                        }
                        // Cancel At Start
                        if (ValidationUtil.nonNull(orderSheetCriteria.getCancelAtStart())) {
                                orderSheetCriteria.getCancelAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(cancelAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.CANCEL_AT),
                                                                                cancelAtStart)));
                        }
                        // Cancel At End
                        if (ValidationUtil.nonNull(orderSheetCriteria.getCancelAtEnd())) {
                                orderSheetCriteria.getCancelAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(cancelAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(OrderSheetEntity_.CANCEL_AT),
                                                                                cancelAtEnd)));
                        }
                        // Status
                        if (ValidationUtil.nonNull(orderSheetCriteria.getStatus())) {
                                orderSheetCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        OrderSheetStatusEnum orderSheetStatusEnum = OrderSheetStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(BillEntity_.STATUS),
                                                                                        orderSheetStatusEnum
                                                                                                        .getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}