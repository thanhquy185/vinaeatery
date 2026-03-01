package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Manager;
import vn.tuhoc.vinaeatery.domain.entity.Manager_;

public class ManagerSpecification {
    // Methods
    public static Specification<Manager> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Manager_.ID), id);
    }

    public static Specification<Manager> fullnameLike(String fullname) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Manager_.FULLNAME),
                "%" + fullname + "%");
    }

    public static Specification<Manager> phoneLike(String phone) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Manager_.PHONE), phone + "%");
    }

    public static Specification<Manager> emailLike(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Manager_.EMAIL), email + "%");
    }

    public static Specification<Manager> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Manager_.STATUS), status);
    }
}