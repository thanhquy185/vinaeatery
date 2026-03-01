package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail_;

public class PermissionDetailSpecification {
    // Methods
    public static Specification<PermissionDetail> permissionIdEqual(String permissionId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(PermissionDetail_.ID).get("permissionId"), permissionId);
    }

    public static Specification<PermissionDetail> functionIdEqual(String functionId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionDetail_.ID).get("functionId"),
                functionId);
    }

    public static Specification<PermissionDetail> actionEqual(String action) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(PermissionDetail_.ID).get("action"),
                action);
    }
}