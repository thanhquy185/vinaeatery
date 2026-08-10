package vn.tuhoc.vinaeatery.modules.food.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity_;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class SupplierSpecification {
    public static Specification<SupplierEntity> filterSuppliers(SupplierCriteria supplierCriteria) {
        if (ValidationUtil.isNull(supplierCriteria.getId())
                && ValidationUtil.isNull(supplierCriteria.getRestaurantId())
                && ValidationUtil.isNull(supplierCriteria.getFullname())
                && ValidationUtil.isNull(supplierCriteria.getPhone())
                && ValidationUtil.isNull(supplierCriteria.getEmail())
                && ValidationUtil.isNull(supplierCriteria.getStatus())
                && ValidationUtil.isNull(supplierCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(supplierCriteria.getId())) {
                supplierCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(SupplierEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(supplierCriteria.getRestaurantId())) {
                supplierCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(SupplierEntity_.RESTAURANT)
                                                .get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Fullname
            if (ValidationUtil.nonNull(supplierCriteria.getFullname())) {
                supplierCriteria.getFullname()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(fullname -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                SupplierEntity_.FULLNAME)),
                                        "%" + fullname.toLowerCase() + "%")));
            }
            // Phone
            if (ValidationUtil.nonNull(supplierCriteria.getPhone())) {
                supplierCriteria.getPhone()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(phone -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                SupplierEntity_.PHONE)),
                                        phone + "%")));
            }
            // Email
            if (ValidationUtil.nonNull(supplierCriteria.getEmail())) {
                supplierCriteria.getEmail()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(email -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                SupplierEntity_.EMAIL)),
                                        email.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(supplierCriteria.getStatus())) {
                supplierCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(SupplierEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}