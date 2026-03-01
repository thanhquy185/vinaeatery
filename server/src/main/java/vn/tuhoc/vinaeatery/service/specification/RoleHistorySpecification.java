package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.RoleHistory;
import vn.tuhoc.vinaeatery.domain.entity.RoleHistory_;

public class RoleHistorySpecification {
    // Methods
    public static Specification<RoleHistory> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleHistory_.ID).get("employeeId"),
                employeeId);
    }

    public static Specification<RoleHistory> roleIdEqual(String roleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleHistory_.ID).get("roleId"), roleId);
    }

    public static Specification<RoleHistory> dateStartEqual(String dateStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleHistory_.ID).get("dateStart"),
                dateStart);
    }
}
