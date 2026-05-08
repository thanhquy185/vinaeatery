package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail_;

public class AllowanceDetailSpecification {
    // Methods
    public static Specification<AllowanceDetail> allowanceIdEqual(String allowanceId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(AllowanceDetail_.ID).get("allowanceId"), allowanceId);
    }   

    public static Specification<AllowanceDetail> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(AllowanceDetail_.ID).get("employeeId"),
                employeeId);
    }

    public static Specification<AllowanceDetail> categoryAllowanceIdEqual(String categoryAllowanceId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get(AllowanceDetail_.ID).get("categoryAllowanceId"),
                categoryAllowanceId);
    }
}