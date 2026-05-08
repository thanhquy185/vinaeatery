package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail_;

public class InsuranceDetailSpecification {
    // Methods
    public static Specification<InsuranceDetail> insuranceIdEqual(String insuranceId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .equal(root.get(InsuranceDetail_.ID).get("insuranceId"), insuranceId);
    }   

    public static Specification<InsuranceDetail> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(InsuranceDetail_.ID).get("employeeId"),
                employeeId);
    }

    public static Specification<InsuranceDetail> categoryInsuranceIdEqual(String categoryInsuranceId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get(InsuranceDetail_.ID).get("categoryInsuranceId"),
                categoryInsuranceId);
    }
}