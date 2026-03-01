package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Permission;
import vn.tuhoc.vinaeatery.domain.entity.Permission_;

public class PermissionSpecification {
    // Methods
    public static Specification<Permission> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Permission_.ID), id);
    }

    public static Specification<Permission> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Permission_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Permission> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Permission_.NAME), "%" + name + "%");
    }

    public static Specification<Permission> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Permission_.STATUS), status);
    }
}