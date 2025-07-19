package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.CustomerCard;
import vn.tuhoc.vinaeatery.domain.CustomerCard_;

public class CustomerCardSpecification {
    // Methods
    public static Specification<CustomerCard> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CustomerCard_.ID), id);
    }

    public static Specification<CustomerCard> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(CustomerCard_.NAME), "%" + name + "%");
    }

    public static Specification<CustomerCard> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(CustomerCard_.STATUS), status);
    }
}
