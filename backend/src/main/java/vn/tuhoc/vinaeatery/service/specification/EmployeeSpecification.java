package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.domain.Employee_;
import vn.tuhoc.vinaeatery.domain.RoleHistory;

public class EmployeeSpecification {
    // Methods
    public static Specification<Employee> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.ID), id);
    }

    public static Specification<Employee> usernameEqual(String username) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.USERNAME), username);
    }

    public static Specification<Employee> fullnameLike(String fullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Employee_.FULLNAME),
                "%" + fullname + "%");
    }

    public static Specification<Employee> phoneEqual(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.PHONE), phone);
    }

    public static Specification<Employee> emailEqual(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.EMAIL), email);
    }

    public static Specification<Employee> roleIdEqual(String roleId) {
        return (root, query, cb) -> {
            // Tạo subquery cho RoleHistory
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<RoleHistory> roleHistoryRoot = subquery.from(RoleHistory.class);

            // Điều kiện: role_id khớp và employee_id = employee.id
            Predicate roleMatch = cb.equal(roleHistoryRoot.get("id").get("roleId"), roleId);
            Predicate employeeMatch = cb.equal(roleHistoryRoot.get("id").get("employeeId"), root.get("id"));
            Predicate dateEndMatch = cb.isNull(roleHistoryRoot.get("dateEnd"));

            subquery.select(roleHistoryRoot.get("id").get("employeeId"))
                    .where(cb.and(roleMatch, employeeMatch, dateEndMatch));

            return cb.exists(subquery);
        };
    }

    public static Specification<Employee> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.STATUS),
                status);
    }
}