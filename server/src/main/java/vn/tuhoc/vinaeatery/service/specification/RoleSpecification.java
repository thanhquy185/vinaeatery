package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Role;
import vn.tuhoc.vinaeatery.domain.entity.Role_;

public class RoleSpecification {
    // Methods
    public static Specification<Role> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Role_.ID), id);
    }

    public static Specification<Role> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Role_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Role> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Role_.NAME), "%" + name + "%");
    }

    public static Specification<Role> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Role_.STATUS), status);
    }
}