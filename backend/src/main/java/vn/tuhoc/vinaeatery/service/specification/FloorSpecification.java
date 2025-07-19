package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.Floor;
import vn.tuhoc.vinaeatery.domain.Floor_;

public class FloorSpecification {
    // Methods
    public static Specification<Floor> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Floor_.ID), id);
    }

    public static Specification<Floor> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(Floor_.NAME),
                "%" + name + "%");
    }

    public static Specification<Floor> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Floor_.STATUS), status);
    }
}
