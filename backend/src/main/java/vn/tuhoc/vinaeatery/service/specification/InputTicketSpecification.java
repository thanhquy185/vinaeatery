package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.InputTicket;
import vn.tuhoc.vinaeatery.domain.entity.InputTicket_;

public class InputTicketSpecification {
    // Methods
    public static Specification<InputTicket> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.ID), id);
    }

    public static Specification<InputTicket> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<InputTicket> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(InputTicket_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<InputTicket> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(InputTicket_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<InputTicket> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<InputTicket> supplierIdEqual(String supplierId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.SUPPLIER_ID),
                supplierId);
    }

    public static Specification<InputTicket> payStatusEqual(Boolean payStatus) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.PAY_STATUS), payStatus);
    }

    public static Specification<InputTicket> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InputTicket_.STATUS), status);
    }
}