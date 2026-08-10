package vn.tuhoc.vinaeatery.modules.auth.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity_;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.repositories.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class UserSpecification {
    public static Specification<UserEntity> filterUsers(UserCriteria UserCriteria) {
        if (ValidationUtil.isNull(UserCriteria.getId())
                && ValidationUtil.isNull(UserCriteria.getUsername())
                && ValidationUtil.isNull(UserCriteria.getRole())
                && ValidationUtil.isNull(UserCriteria.getMethod())
                && ValidationUtil.isNull(UserCriteria.getStatus())
                && ValidationUtil.isNull(UserCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(UserCriteria.getId())) {
                UserCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(UserEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Username
            if (ValidationUtil.nonNull(UserCriteria.getUsername())) {
                UserCriteria.getUsername()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(username -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(UserEntity_.username)),
                                        "%" + username.toLowerCase() + "%")));
            }
            // Role
            if (ValidationUtil.nonNull(UserCriteria.getRole())) {
                UserCriteria.getRole()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(role -> {
                            UserRoleEnum roleEnum = UserRoleEnum.fromDescription(role);
                            predicates.add(criteriaBuilder.equal(
                                    root.get(UserEntity_.ROLE),
                                    roleEnum.getValue()));
                        });
            }
            // Method
            if (ValidationUtil.nonNull(UserCriteria.getMethod())) {
                UserCriteria.getMethod()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(method -> {
                            UserMethodEnum methodEnum = UserMethodEnum.fromDescription(method);
                            predicates.add(criteriaBuilder.equal(
                                    root.get(UserEntity_.method),
                                    methodEnum.getValue()));
                        });
            }
            // Status
            if (ValidationUtil.nonNull(UserCriteria.getStatus())) {
                UserCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(criteriaBuilder.equal(
                                    root.get(UserEntity_.STATUS),
                                    statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
