package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.OrderTable;
import vn.tuhoc.vinaeatery.domain.OrderTable_;

public class OrderTableSpecification {
    // Methods
    public static Specification<OrderTable> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.ID), id);
    }

    public static Specification<OrderTable> timeOrderAfter(String timeOrderStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderTable_.TIME_ORDER),
                        LocalDateTime.parse(timeOrderStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> timeOrderBefore(String timeOrderEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderTable_.TIME_ORDER),
                        LocalDateTime.parse(timeOrderEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> timeArriveAfter(String timeArriveStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderTable_.TIME_ARRIVE),
                        LocalDateTime.parse(timeArriveStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> timeArriveBefore(String timeArriveEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderTable_.TIME_ARRIVE),
                        LocalDateTime.parse(timeArriveEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderTable> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<OrderTable> fullnameLike(String fullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.FULLNAME),
                "%" + fullname + "%");
    }

    public static Specification<OrderTable> phoneLike(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.PHONE), phone + "%");
    }

    public static Specification<OrderTable> emailLike(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(OrderTable_.EMAIL), email + "%");
    }

    public static Specification<OrderTable> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderTable_.STATUS), status);
    }
}
