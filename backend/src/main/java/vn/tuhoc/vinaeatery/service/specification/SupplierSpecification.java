package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Supplier;
import vn.tuhoc.vinaeatery.domain.entity.Supplier_;

public class SupplierSpecification {
    // Methods
    public static Specification<Supplier> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Supplier_.ID), id);
    }

    public static Specification<Supplier> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Supplier_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Supplier> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Supplier_.NAME), "%" + name + "%");
    }

    public static Specification<Supplier> phoneLike(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Supplier_.PHONE), phone + "%");
    }

    public static Specification<Supplier> emailLike(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Supplier_.EMAIL), email + "%");
    }

    public static Specification<Supplier> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Supplier_.STATUS), status);
    }
}