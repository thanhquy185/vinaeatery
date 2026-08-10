package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.ReservationCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class ReservationSpecification {
        public static Specification<ReservationEntity> filterReservations(ReservationCriteria reservationCriteria) {
                if (ValidationUtil.isNull(reservationCriteria.getId())
                                && ValidationUtil.isNull(reservationCriteria.getRestaurantId())
                                && ValidationUtil.isNull(reservationCriteria.getEmployeeId())
                                && ValidationUtil.isNull(reservationCriteria.getCustomerId())
                                && ValidationUtil.isNull(reservationCriteria.getCreateAtStart())
                                && ValidationUtil.isNull(reservationCriteria.getCreateAtEnd())
                                && ValidationUtil.isNull(reservationCriteria.getArriveAtStart())
                                && ValidationUtil.isNull(reservationCriteria.getArriveAtEnd())
                                && ValidationUtil.isNull(reservationCriteria.getCustomerFullname())
                                && ValidationUtil.isNull(reservationCriteria.getCustomerPhone())
                                && ValidationUtil.isNull(reservationCriteria.getCustomerEmail())
                                && ValidationUtil.isNull(reservationCriteria.getStatus())
                                && ValidationUtil.isNull(reservationCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(reservationCriteria.getId())) {
                                reservationCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(ReservationEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(reservationCriteria.getRestaurantId())) {
                                reservationCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(ReservationEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Employee Id
                        if (ValidationUtil.nonNull(reservationCriteria.getEmployeeId())) {
                                reservationCriteria.getEmployeeId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(employeeId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(ReservationEntity_.EMPLOYEE)
                                                                                                .get("id"),
                                                                                Long.valueOf(employeeId))));
                        }
                        // Customer Id
                        if (ValidationUtil.nonNull(reservationCriteria.getCustomerId())) {
                                reservationCriteria.getCustomerId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(customerId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(ReservationEntity_.CUSTOMER)
                                                                                                .get("id"),
                                                                                Long.valueOf(customerId))));
                        }
                        // Create At Start
                        if (ValidationUtil.nonNull(reservationCriteria.getCreateAtStart())) {
                                reservationCriteria.getCreateAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(ReservationEntity_.CREATE_AT),
                                                                                createAtStart)));
                        }
                        // Create At End
                        if (ValidationUtil.nonNull(reservationCriteria.getCreateAtEnd())) {
                                reservationCriteria.getCreateAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(ReservationEntity_.CREATE_AT),
                                                                                createAtEnd)));
                        }
                        // Arrive At Start
                        if (ValidationUtil.nonNull(reservationCriteria.getArriveAtStart())) {
                                reservationCriteria.getArriveAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(arriveAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(ReservationEntity_.ARRIVE_AT),
                                                                                arriveAtStart)));
                        }
                        // Arrive At End
                        if (ValidationUtil.nonNull(reservationCriteria.getArriveAtEnd())) {
                                reservationCriteria.getArriveAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(arriveAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(ReservationEntity_.ARRIVE_AT),
                                                                                arriveAtEnd)));
                        }
                        // Customer Fullname
                        if (ValidationUtil.nonNull(reservationCriteria.getCustomerFullname())) {
                                reservationCriteria.getCustomerFullname()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(customerFullname -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ReservationEntity_.CUSTOMER_FULLNAME)),
                                                                                "%" + customerFullname.toLowerCase()
                                                                                                + "%")));
                        }
                        // Customer Phone
                        if (ValidationUtil.nonNull(reservationCriteria.getCustomerPhone())) {
                                reservationCriteria.getCustomerPhone()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(customerPhone -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ReservationEntity_.CUSTOMER_PHONE)),
                                                                                customerPhone + "%")));
                        }
                        // Customer Email
                        if (ValidationUtil.nonNull(reservationCriteria.getCustomerEmail())) {
                                reservationCriteria.getCustomerEmail()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(customerEmail -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ReservationEntity_.CUSTOMER_EMAIL)),
                                                                                customerEmail + "%")));
                        }
                        // Status
                        if (ValidationUtil.nonNull(reservationCriteria.getStatus())) {
                                reservationCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        ReservationStatusEnum statusEnum = ReservationStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root
                                                                                        .get(ReservationEntity_.STATUS),
                                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}
