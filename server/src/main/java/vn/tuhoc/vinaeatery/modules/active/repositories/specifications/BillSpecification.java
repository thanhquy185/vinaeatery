package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.BillCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class BillSpecification {
        public static Specification<BillEntity> filterBills(BillCriteria billCriteria) {
                if (ValidationUtil.isNull(billCriteria.getId())
                                && ValidationUtil.isNull(billCriteria.getRestaurantId())
                                && ValidationUtil.isNull(billCriteria.getEmployeeId())
                                && ValidationUtil.isNull(billCriteria.getCustomerId())
                                && ValidationUtil.isNull(billCriteria.getPaymentMethodId())
                                && ValidationUtil.isNull(billCriteria.getCreateAtStart())
                                && ValidationUtil.isNull(billCriteria.getCreateAtEnd())
                                && ValidationUtil.isNull(billCriteria.getPaymentStatus())
                                && ValidationUtil.isNull(billCriteria.getStatus())
                                && ValidationUtil.isNull(billCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(billCriteria.getId())) {
                                billCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(BillEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(billCriteria.getRestaurantId())) {
                                billCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(BillEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(billCriteria.getEmployeeId())) {
                                billCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(BillEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Customer Id
                        if (ValidationUtil.nonNull(billCriteria.getCustomerId())) {
                                billCriteria.getCustomerId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(customerId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(BillEntity_.CUSTOMER)
                                                                                                .get("id"),
                                                                                Long.valueOf(customerId))));
                        }
                        // Payment Method Id
                        if (ValidationUtil.nonNull(billCriteria.getPaymentMethodId())) {
                                billCriteria.getPaymentMethodId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(paymentMethodId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(BillEntity_.PAYMENT_METHOD)
                                                                                                .get("id"),
                                                                                Long.valueOf(paymentMethodId))));
                        }
                        // Create At Start
                        if (ValidationUtil.nonNull(billCriteria.getCreateAtStart())) {
                                billCriteria.getCreateAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(BillEntity_.CREATE_AT),
                                                                                createAtStart)));
                        }
                        // Create At End
                        if (ValidationUtil.nonNull(billCriteria.getCreateAtEnd())) {
                                billCriteria.getCreateAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(BillEntity_.CREATE_AT),
                                                                                createAtEnd)));
                        }
                        // Payment Status
                        if (ValidationUtil.nonNull(billCriteria.getPaymentStatus())) {
                                billCriteria.getPaymentStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(paymentStatus -> {
                                                        BillPaymentStatusEnum billPaymentStatusEnum = BillPaymentStatusEnum
                                                                        .fromDescription(paymentStatus);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root.get(
                                                                                        BillEntity_.PAYMENT_STATUS),
                                                                                        billPaymentStatusEnum
                                                                                                        .getValue()));
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(billCriteria.getStatus())) {
                                billCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        BillStatusEnum billStatusEnum = BillStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(BillEntity_.STATUS),
                                                                                        billStatusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}