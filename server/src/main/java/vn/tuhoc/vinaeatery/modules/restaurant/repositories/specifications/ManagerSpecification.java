package vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity_;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.ManagerCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class ManagerSpecification {
        public static Specification<ManagerEntity> filterManagers(ManagerCriteria managerCriteria) {
                if (ValidationUtil.isNull(managerCriteria.getId())
                                && ValidationUtil.isNull(managerCriteria.getFullname())
                                && ValidationUtil.isNull(managerCriteria.getUsername())
                                && ValidationUtil.isNull(managerCriteria.getPhone())
                                && ValidationUtil.isNull(managerCriteria.getEmail())
                                && ValidationUtil.isNull(managerCriteria.getStatus())
                                && ValidationUtil.isNull(managerCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(managerCriteria.getId())) {
                                managerCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(ManagerEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Fullname
                        if (ValidationUtil.nonNull(managerCriteria.getFullname())) {
                                managerCriteria.getFullname()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(fullname -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ManagerEntity_.FULLNAME)),
                                                                                "%" + fullname.toLowerCase() + "%")));
                        }
                        // Username
                        if (ValidationUtil.nonNull(managerCriteria.getUsername())) {
                                managerCriteria.getUsername()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(username -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ManagerEntity_.USER)
                                                                                                .get("username")),
                                                                                username.toLowerCase() + "%")));
                        }
                        // Phone
                        if (ValidationUtil.nonNull(managerCriteria.getPhone())) {
                                managerCriteria.getPhone()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(phone -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ManagerEntity_.PHONE)),
                                                                                phone + "%")));
                        }
                        // Email
                        if (ValidationUtil.nonNull(managerCriteria.getEmail())) {
                                managerCriteria.getEmail()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(email -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                ManagerEntity_.EMAIL)),
                                                                                email.toLowerCase() + "%")));
                        }
                        // Status
                        if (ValidationUtil.nonNull(managerCriteria.getStatus())) {
                                managerCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        CommonStatusEnum statusEnum = CommonStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(criteriaBuilder.equal(
                                                                        root.get(ManagerEntity_.STATUS),
                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}