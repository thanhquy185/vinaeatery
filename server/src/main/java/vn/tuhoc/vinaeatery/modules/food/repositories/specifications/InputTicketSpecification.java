package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity_;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class InputTicketSpecification {
        public static Specification<InputTicketEntity> filterInputTickets(InputTicketCriteria inputTicketCriteria) {
                if (ValidationUtil.isNull(inputTicketCriteria.getId())
                                && ValidationUtil.isNull(inputTicketCriteria.getRestaurantId())
                                && ValidationUtil.isNull(inputTicketCriteria.getCreateAtStart())
                                && ValidationUtil.isNull(inputTicketCriteria.getCreateAtEnd())
                                && ValidationUtil.isNull(inputTicketCriteria.getEmployeeId())
                                && ValidationUtil.isNull(inputTicketCriteria.getSupplierId())
                                && ValidationUtil.isNull(inputTicketCriteria.getPaymentStatus())
                                && ValidationUtil.isNull(inputTicketCriteria.getStatus())
                                && ValidationUtil.isNull(inputTicketCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(inputTicketCriteria.getId())) {
                                inputTicketCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(InputTicketEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(inputTicketCriteria.getRestaurantId())) {
                                inputTicketCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(InputTicketEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(inputTicketCriteria.getEmployeeId())) {
                                inputTicketCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(InputTicketEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Supplier Id
                        if (ValidationUtil.nonNull(inputTicketCriteria.getSupplierId())) {
                                inputTicketCriteria.getSupplierId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(supplierId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(InputTicketEntity_.SUPPLIER)
                                                                                                .get("id"),
                                                                                Long.valueOf(supplierId))));
                        }
                        // Create At Start
                        if (ValidationUtil.nonNull(inputTicketCriteria.getCreateAtStart())) {
                                inputTicketCriteria.getCreateAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(InputTicketEntity_.CREATE_AT),
                                                                                createAtStart)));
                        }
                        // Create At End
                        if (ValidationUtil.nonNull(inputTicketCriteria.getCreateAtEnd())) {
                                inputTicketCriteria.getCreateAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(InputTicketEntity_.CREATE_AT),
                                                                                createAtEnd)));
                        }
                        // Payment Status
                        if (ValidationUtil.nonNull(inputTicketCriteria.getPaymentStatus())) {
                                inputTicketCriteria.getPaymentStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(paymentStatus -> {
                                                        InputTicketPaymentStatusEnum inputTicketPaymentStatusEnum = InputTicketPaymentStatusEnum
                                                                        .fromDescription(paymentStatus);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root.get(
                                                                                        InputTicketEntity_.PAYMENT_STATUS),
                                                                                        inputTicketPaymentStatusEnum
                                                                                                        .getValue()));
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(inputTicketCriteria.getStatus())) {
                                inputTicketCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        InputTicketStatusEnum inputTicketStatusEnum = InputTicketStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root
                                                                                        .get(InputTicketEntity_.STATUS),
                                                                                        inputTicketStatusEnum
                                                                                                        .getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}