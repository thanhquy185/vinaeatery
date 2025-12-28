package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Restaurant;
import vn.tuhoc.vinaeatery.domain.entity.Restaurant_;

public class RestaurantSpecification {
    // Methods
    public static Specification<Restaurant> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Restaurant_.ID), id);
    }

    public static Specification<Restaurant> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Restaurant_.NAME),
                "%" + name + "%");
    }

    public static Specification<Restaurant> phoneLike(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Restaurant_.PHONE), phone + "%");
    }

    public static Specification<Restaurant> emailLike(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Restaurant_.EMAIL), email + "%");
    }

    public static Specification<Restaurant> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Restaurant_.STATUS), status);
    }
}