package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.HandlePayment;
import vn.tuhoc.vinaeatery.domain.HandlePayment_;

public class HandlePaymentSpecification {
    // Methods
    public static Specification<HandlePayment> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(HandlePayment_.USE_TABLE_ID), id);
    }

     public static Specification<HandlePayment> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(HandlePayment_.STATUS), status);
    }
}
