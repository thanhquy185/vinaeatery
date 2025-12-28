package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Order;
import vn.tuhoc.vinaeatery.domain.entity.Order_;

public class OrderSpecification {
    // Methods
    public static Specification<Order> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.ID), id);
    }

    public static Specification<Order> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.RESTAURANT_ID), restaurantId);
    }   

    public static Specification<Order> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<Order> customerIdEqual(String customerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.CUSTOMER_ID),
                customerId);
    }

    public static Specification<Order> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(Order_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<Order> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(Order_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<Order> payStatusEqual(Boolean payStatus) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.PAY_STATUS), payStatus);
    }

    public static Specification<Order> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Order_.STATUS), status);
    }
}