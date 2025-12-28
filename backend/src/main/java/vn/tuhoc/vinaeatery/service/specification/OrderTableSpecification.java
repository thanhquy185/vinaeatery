package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.OrderTable;
import vn.tuhoc.vinaeatery.domain.entity.OrderTable_;

public class OrderTableSpecification {
    // Methods
    public static Specification<OrderTable> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.ID), id);
    }

    public static Specification<OrderTable> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.RESTAURANT_ID),
                restaurantId);
    }

    public static Specification<OrderTable> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<OrderTable> customerIdEqual(String customerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.CUSTOMER_ID),
                customerId);
    }

    public static Specification<OrderTable> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderTable_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderTable_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> arriveAtAfter(String arriveAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderTable_.ARRIVE_AT), arriveAtStart);
    }

    public static Specification<OrderTable> arriveAtBefore(String arriveAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderTable_.ARRIVE_AT), arriveAtEnd);
    }

    public static Specification<OrderTable> customerFullnameLike(String customerFullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.CUSTOMER_FULLNAME),
                "%" + customerFullname + "%");
    }

    public static Specification<OrderTable> customerPhoneLike(String customerPhone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.CUSTOMER_PHONE),
                customerPhone + "%");
    }

    public static Specification<OrderTable> customerEmailLike(String customerEmail) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.CUSTOMER_EMAIL),
                customerEmail + "%");
    }

    public static Specification<OrderTable> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.STATUS), status);
    }
}
