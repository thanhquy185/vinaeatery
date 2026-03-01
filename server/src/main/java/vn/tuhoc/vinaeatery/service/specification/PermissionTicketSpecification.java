package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;
import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket_;

public class PermissionTicketSpecification {
    // Methods
    public static Specification<PermissionTicket> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionTicket_.ID), id);
    }

    public static Specification<PermissionTicket> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionTicket_.RESTAURANT_ID),
                restaurantId);
    }

    public static Specification<PermissionTicket> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(PermissionTicket_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<PermissionTicket> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(PermissionTicket_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<PermissionTicket> employeeHandleIdEqual(String employeeHandleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionTicket_.EMPLOYEE_HANDLE_ID),
                employeeHandleId);
    }

    public static Specification<PermissionTicket> employeeMainIdEqual(String employeeMainId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionTicket_.EMPLOYEE_MAIN_ID),
                employeeMainId);
    }

    public static Specification<PermissionTicket> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionTicket_.STATUS), status);
    }
}