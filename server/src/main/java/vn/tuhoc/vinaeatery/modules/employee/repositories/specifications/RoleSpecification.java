package vn.tuhoc.vinaeatery.modules.employee.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity_;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class RoleSpecification {
    public static Specification<RoleEntity> filterRoles(RoleCriteria roleCriteria) {
        if (ValidationUtil.isNull(roleCriteria.getId())
                && ValidationUtil.isNull(roleCriteria.getRestaurantId())
                && ValidationUtil.isNull(roleCriteria.getName())
                && ValidationUtil.isNull(roleCriteria.getSort())
                && ValidationUtil.isNull(roleCriteria.getStatus())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(roleCriteria.getId())) {
                roleCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(RoleEntity_.ID), Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(roleCriteria.getRestaurantId())) {
                roleCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(RoleEntity_.RESTAURANT).get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Name
            if (ValidationUtil.nonNull(roleCriteria.getName())) {
                roleCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(RoleEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(roleCriteria.getStatus())) {
                roleCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(RoleEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}