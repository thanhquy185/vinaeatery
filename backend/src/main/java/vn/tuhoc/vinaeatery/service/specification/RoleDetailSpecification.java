package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.RoleDetail;
import vn.tuhoc.vinaeatery.domain.entity.RoleDetail_;

public class RoleDetailSpecification {
    // Methods
    public static Specification<RoleDetail> roleIdEqual(String roleId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleDetail_.ID).get("roleId"), roleId);
    }

    public static Specification<RoleDetail> functionIdEqual(String functionId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleDetail_.ID).get("functionId"),
                functionId);
    }

    public static Specification<RoleDetail> actionEqual(String action) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(RoleDetail_.ID).get("action"), action);
    }
}