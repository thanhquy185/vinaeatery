package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.RewardPunish;
import vn.tuhoc.vinaeatery.domain.entity.RewardPunish_;

public class RewardPunishSpecification {
    // Methods
    public static Specification<RewardPunish> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RewardPunish_.ID), id);
    }

    public static Specification<RewardPunish> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RewardPunish_.RESTAURANT_ID),
                restaurantId);
    }

    public static Specification<RewardPunish> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(RewardPunish_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<RewardPunish> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(RewardPunish_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<RewardPunish> employeeHandleIdEqual(String employeeHandleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RewardPunish_.EMPLOYEE_HANDLE_ID),
                employeeHandleId);
    }

    public static Specification<RewardPunish> employeeMainIdEqual(String employeeMainId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RewardPunish_.EMPLOYEE_MAIN_ID),
                employeeMainId);
    }

    public static Specification<RewardPunish> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RewardPunish_.STATUS), status);
    }
}