package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.domain.Employee_;
import vn.tuhoc.vinaeatery.domain.RoleHistory;

public class EmployeeSpecification {
    // Tìm kiếm theo mã người dùng
    public static Specification<Employee> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.ID), id);
    }

    // Tìm kiếm theo tên người dùng
    public static Specification<Employee> usernameEqual(String username) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.USERNAME), username);
    }

    // Tìm kiếm theo họ và tên
    public static Specification<Employee> fullnameLike(String fullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Employee_.FULLNAME),
                "%" + fullname + "%");
    }

    // Tìm kiếm theo số điện thoại
    public static Specification<Employee> phoneEqual(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.PHONE), phone);
    }

    // Tìm kiếm theo email
    public static Specification<Employee> emailEqual(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.EMAIL), email);
    }

    // Tìm kiếm theo mã chức vụ (hiện tại)
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

    // Tìm theo theo trạng thái
    public static Specification<Employee> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Employee_.STATUS),
                status);
    }
}