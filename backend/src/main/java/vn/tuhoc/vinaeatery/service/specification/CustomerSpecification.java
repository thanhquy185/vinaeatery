package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.Customer;
import vn.tuhoc.vinaeatery.domain.Customer_;

public class CustomerSpecification {
    // Methods
    public static Specification<Customer> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Customer_.ID), id);
    }

    public static Specification<Customer> customerCardIdEqual(String customerCardId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Customer_.CUSTOMER_CARD_ID),
                customerCardId);
    }

    public static Specification<Customer> fullnameLike(String fullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Customer_.FULLNAME), "%" + fullname + "%");
    }

    public static Specification<Customer> phoneLike(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Customer_.PHONE), phone + "%");
    }

    public static Specification<Customer> emailLike(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Customer_.EMAIL), email + "%");
    }

    public static Specification<Customer> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Customer_.STATUS), status);
    }
}