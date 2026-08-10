package vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity_;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

public class CustomerSpecification {
        public static Specification<CustomerEntity> filterCustomers(CustomerCriteria customerCriteria) {
                if (ValidationUtil.isNull(customerCriteria.getId())
                                && ValidationUtil.isNull(customerCriteria.getFullname())
                                && ValidationUtil.isNull(customerCriteria.getUsername())
                                && ValidationUtil.isNull(customerCriteria.getPhone())
                                && ValidationUtil.isNull(customerCriteria.getEmail())
                                && ValidationUtil.isNull(customerCriteria.getStatus())
                                && ValidationUtil.isNull(customerCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(customerCriteria.getId())) {
                                customerCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(CustomerEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Fullname
                        if (ValidationUtil.nonNull(customerCriteria.getFullname())) {
                                customerCriteria.getFullname()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(fullname -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                CustomerEntity_.FULLNAME)),
                                                                                "%" + fullname.toLowerCase() + "%")));
                        }
                        // Username
                        if (ValidationUtil.nonNull(customerCriteria.getUsername())) {
                                customerCriteria.getUsername()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(username -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                CustomerEntity_.USER)
                                                                                                .get("username")),
                                                                                username.toLowerCase() + "%")));
                        }
                        // Phone
                        if (ValidationUtil.nonNull(customerCriteria.getPhone())) {
                                customerCriteria.getPhone()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(phone -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                CustomerEntity_.PHONE)),
                                                                                phone + "%")));
                        }
                        // Email
                        if (ValidationUtil.nonNull(customerCriteria.getEmail())) {
                                customerCriteria.getEmail()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(email -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                CustomerEntity_.EMAIL)),
                                                                                email.toLowerCase() + "%")));
                        }
                        // Status
                        if (ValidationUtil.nonNull(customerCriteria.getStatus())) {
                                customerCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        CommonStatusEnum statusEnum = CommonStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(criteriaBuilder.equal(
                                                                        root.get(CustomerEntity_.STATUS),
                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}