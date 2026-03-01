package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.entity.User_;

public class UserSpecification {
    // Methods
    public static Specification<User> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(User_.ID), id);
    }

    public static Specification<User> roleEqual(String role) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(User_.ROLE), role);
    }

    public static Specification<User> usernameLike(String username) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(User_.USERNAME),
                "%" + username + "%");
    }

    public static Specification<User> methodEqual(String method) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(User_.METHOD),
                method);
    }

    public static Specification<User> isUsingEqual(Boolean isUsing) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(User_.IS_USING),
                isUsing);
    }

    // public static Specification<User> fullnameLike(String fullname) {
    //     return (root, query, cb) -> {

    //         Join<User, Manager> managerJoin = root.join("manager", JoinType.LEFT);
    //         Join<User, Customer> customerJoin = root.join("customer", JoinType.LEFT);

    //         return cb.or(
    //                 cb.like(managerJoin.get("fullname"), "%" + fullname + "%"),
    //                 cb.like(customerJoin.get("fullname"), "%" + fullname + "%"));
    //     };
    // }

    // public static Specification<User> phoneLike(String phone) {
    //     return (root, query, cb) -> {

    //         Join<User, Manager> managerJoin = root.join("manager", JoinType.LEFT);
    //         Join<User, Customer> customerJoin = root.join("customer", JoinType.LEFT);

    //         return cb.or(
    //                 cb.like(managerJoin.get("phone"), phone + "%"),
    //                 cb.like(customerJoin.get("phone"), phone + "%"));
    //     };
    // }

    // public static Specification<User> emailLike(String email) {
    //     return (root, query, cb) -> {

    //         Join<User, Manager> managerJoin = root.join("manager", JoinType.LEFT);
    //         Join<User, Customer> customerJoin = root.join("customer", JoinType.LEFT);

    //         return cb.or(
    //                 cb.like(managerJoin.get("email"), email + "%"),
    //                 cb.like(customerJoin.get("email"), email + "%"));
    //     };
    // }

    public static Specification<User> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(User_.STATUS),
                status);
    }
}
