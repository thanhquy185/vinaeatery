package vn.tuhoc.vinaeatery.modules.employee.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity_;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class PermissionSpecification {
    public static Specification<PermissionEntity> filterPermissions(PermissionCriteria permissionCriteria) {
        if (ValidationUtil.isNull(permissionCriteria.getId())
                && ValidationUtil.isNull(permissionCriteria.getRestaurantId())
                && ValidationUtil.isNull(permissionCriteria.getName())
                && ValidationUtil.isNull(permissionCriteria.getStatus())
                && ValidationUtil.isNull(permissionCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(permissionCriteria.getId())) {
                permissionCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(PermissionEntity_.ID), Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(permissionCriteria.getRestaurantId())) {
                permissionCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(PermissionEntity_.RESTAURANT).get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Name
            if (ValidationUtil.nonNull(permissionCriteria.getName())) {
                permissionCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(PermissionEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(permissionCriteria.getStatus())) {
                permissionCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(PermissionEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}