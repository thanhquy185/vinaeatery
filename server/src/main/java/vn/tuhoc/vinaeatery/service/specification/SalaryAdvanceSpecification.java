package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance;
import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance_;

public class SalaryAdvanceSpecification {
    // Methods
    public static Specification<SalaryAdvance> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(SalaryAdvance_.ID), id);
    }

    public static Specification<SalaryAdvance> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(SalaryAdvance_.RESTAURANT_ID),
                restaurantId);
    }

    public static Specification<SalaryAdvance> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(SalaryAdvance_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<SalaryAdvance> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(SalaryAdvance_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<SalaryAdvance> employeeHandleIdEqual(String employeeHandleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(SalaryAdvance_.EMPLOYEE_HANDLE_ID),
                employeeHandleId);
    }

    public static Specification<SalaryAdvance> employeeMainIdEqual(String employeeMainId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(SalaryAdvance_.EMPLOYEE_MAIN_ID),
                employeeMainId);
    }

    public static Specification<SalaryAdvance> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(SalaryAdvance_.STATUS), status);
    }
}