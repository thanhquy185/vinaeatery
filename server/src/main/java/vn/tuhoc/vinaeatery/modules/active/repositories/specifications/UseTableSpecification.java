package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class UseTableSpecification {
        public static Specification<UseTableEntity> filterUseTables(UseTableCriteria useTableCriteria) {
                if (ValidationUtil.isNull(useTableCriteria.getId())
                                && ValidationUtil.isNull(useTableCriteria.getRestaurantId())
                                && ValidationUtil.isNull(useTableCriteria.getTableId())
                                && ValidationUtil.isNull(useTableCriteria.getTableName())
                                && ValidationUtil.isNull(useTableCriteria.getFloorId())
                                && ValidationUtil.isNull(useTableCriteria.getEmployeeId())
                                && ValidationUtil.isNull(useTableCriteria.getCustomerId())
                                && ValidationUtil.isNull(useTableCriteria.getBillId())
                                && ValidationUtil.isNull(useTableCriteria.getReservationId())
                                && ValidationUtil.isNull(useTableCriteria.getStartAtStart())
                                && ValidationUtil.isNull(useTableCriteria.getStartAtEnd())
                                && ValidationUtil.isNull(useTableCriteria.getEndAtStart())
                                && ValidationUtil.isNull(useTableCriteria.getEndAtEnd())
                                && ValidationUtil.isNull(useTableCriteria.getStatus())
                                && ValidationUtil.isNull(useTableCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(useTableCriteria.getId())) {
                                useTableCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(UseTableEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(useTableCriteria.getRestaurantId())) {
                                useTableCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Table Id
                        if (ValidationUtil.nonNull(useTableCriteria.getTableId())) {
                                useTableCriteria.getTableId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(tableId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.TABLE)
                                                                                                .get("id"),
                                                                                Long.valueOf(tableId))));
                        }
                        // Table Name
                        if (ValidationUtil.nonNull(useTableCriteria.getTableName())) {
                                useTableCriteria.getTableName()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(tableName -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(
                                                                                                root.get(UseTableEntity_.TABLE)
                                                                                                                .get("name")),
                                                                                "%" + tableName.toLowerCase() + "%")));
                        }
                        // Floor Id
                        if (ValidationUtil.nonNull(useTableCriteria.getFloorId())) {
                                useTableCriteria.getFloorId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(floorId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.TABLE)
                                                                                                .get("floor").get("id"),
                                                                                Long.valueOf(floorId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(useTableCriteria.getEmployeeId())) {
                                useTableCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Customer Id
                        if (ValidationUtil.nonNull(useTableCriteria.getCustomerId())) {
                                useTableCriteria.getCustomerId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(customerId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.CUSTOMER)
                                                                                                .get("id"),
                                                                                Long.valueOf(customerId))));
                        }
                        // Bill Id
                        if (ValidationUtil.nonNull(useTableCriteria.getBillId())) {
                                useTableCriteria.getBillId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(billId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.BILL)
                                                                                                .get("id"),
                                                                                Long.valueOf(billId))));
                        }
                        // Reservation Id
                        if (ValidationUtil.nonNull(useTableCriteria.getReservationId())) {
                                useTableCriteria.getReservationId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(reservationId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(UseTableEntity_.RESERVATION)
                                                                                                .get("id"),
                                                                                Long.valueOf(reservationId))));
                        }
                        // Start At Start
                        if (ValidationUtil.nonNull(useTableCriteria.getStartAtStart())) {
                                useTableCriteria.getStartAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(startAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(UseTableEntity_.START_AT),
                                                                                startAtStart)));
                        }
                        // Start At End
                        if (ValidationUtil.nonNull(useTableCriteria.getStartAtEnd())) {
                                useTableCriteria.getStartAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(startAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(UseTableEntity_.START_AT),
                                                                                startAtEnd)));
                        }
                        // End At Start
                        if (ValidationUtil.nonNull(useTableCriteria.getEndAtStart())) {
                                useTableCriteria.getEndAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(endAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(UseTableEntity_.END_AT),
                                                                                endAtStart)));
                        }
                        // End At End
                        if (ValidationUtil.nonNull(useTableCriteria.getEndAtEnd())) {
                                useTableCriteria.getEndAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(endAtEnd -> {
                                                        if (endAtEnd.equals("null")) {
                                                                predicates.add(
                                                                                criteriaBuilder.isNull(
                                                                                                root.get(UseTableEntity_.END_AT)));
                                                        } else {
                                                                predicates.add(
                                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                                root.get(UseTableEntity_.END_AT),
                                                                                                endAtEnd));
                                                        }
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(useTableCriteria.getStatus())) {
                                useTableCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        UseTableStatusEnum useTableStatusEnum = UseTableStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(UseTableEntity_.STATUS),
                                                                                        useTableStatusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}