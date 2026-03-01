package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket;
import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket_;

public class CategoryPermissionTicketSpecification {
    // Methods
    public static Specification<CategoryPermissionTicket> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryPermissionTicket_.ID), id);
    }

    public static Specification<CategoryPermissionTicket> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryPermissionTicket_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<CategoryPermissionTicket> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CategoryPermissionTicket_.NAME),
                "%" + name + "%");
    }

    public static Specification<CategoryPermissionTicket> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CategoryPermissionTicket_.STATUS), status);
    }
}
