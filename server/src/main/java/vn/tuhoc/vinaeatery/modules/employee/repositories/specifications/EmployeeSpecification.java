package vn.tuhoc.vinaeatery.modules.employee.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity_;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity_;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class EmployeeSpecification {
        public static Specification<EmployeeEntity> filterEmployees(EmployeeCriteria employeeCriteria) {
                if (ValidationUtil.isNull(employeeCriteria.getId())
                                && ValidationUtil.isNull(employeeCriteria.getRestaurantId())
                                && ValidationUtil.isNull(employeeCriteria.getRoleId())
                                && ValidationUtil.isNull(employeeCriteria.getPermissionId())
                                && ValidationUtil.isNull(employeeCriteria.getFullname())
                                && ValidationUtil.isNull(employeeCriteria.getUsername())
                                && ValidationUtil.isNull(employeeCriteria.getPhone())
                                && ValidationUtil.isNull(employeeCriteria.getEmail())
                                && ValidationUtil.isNull(employeeCriteria.getStatus())
                                && ValidationUtil.isNull(employeeCriteria.getSort())) {
                        return null;
                }

                return (root, query, criteriaBuilder) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        // Id
                        if (ValidationUtil.nonNull(employeeCriteria.getId())) {
                                employeeCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(EmployeeEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(employeeCriteria.getRestaurantId())) {
                                employeeCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(EmployeeEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Role Id
                        if (ValidationUtil.nonNull(employeeCriteria.getRoleId())) {
                                employeeCriteria.getRoleId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(roleId -> {
                                                        Subquery<Long> subquery = query.subquery(Long.class);
                                                        Root<RoleHistoryEntity> roleHistoryRoot = subquery
                                                                        .from(RoleHistoryEntity.class);

                                                        Predicate roleMatch = criteriaBuilder.equal(
                                                                        roleHistoryRoot.get("id").get("roleId"),
                                                                        Long.valueOf(roleId));

                                                        Predicate employeeMatch = criteriaBuilder.equal(
                                                                        roleHistoryRoot.get("id").get("employeeId"),
                                                                        root.get(EmployeeEntity_.ID));

                                                        Predicate currentRoleMatch = criteriaBuilder.isNull(
                                                                        roleHistoryRoot.get(
                                                                                        RoleHistoryEntity_.DATE_END));

                                                        subquery.select(
                                                                        roleHistoryRoot.get("id").get("employeeId"))
                                                                        .where(criteriaBuilder.and(
                                                                                        roleMatch,
                                                                                        employeeMatch,
                                                                                        currentRoleMatch));

                                                        predicates.add(criteriaBuilder.exists(subquery));
                                                });
                        }
                        // Permission Id
                        if (ValidationUtil.nonNull(employeeCriteria.getPermissionId())) {
                                employeeCriteria.getPermissionId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(permissionId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(EmployeeEntity_.PERMISSION)
                                                                                                .get("id"),
                                                                                Long.valueOf(permissionId))));
                        }
                        // Fullname
                        if (ValidationUtil.nonNull(employeeCriteria.getFullname())) {
                                employeeCriteria.getFullname()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(fullname -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                EmployeeEntity_.FULLNAME)),
                                                                                "%" + fullname.toLowerCase() + "%")));
                        }
                        // Username
                        if (ValidationUtil.nonNull(employeeCriteria.getUsername())) {
                                employeeCriteria.getUsername()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(username -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                EmployeeEntity_.USER).get("username")),
                                                                                username.toLowerCase() + "%")));
                        }
                        // Phone
                        if (ValidationUtil.nonNull(employeeCriteria.getPhone())) {
                                employeeCriteria.getPhone()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(phone -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                EmployeeEntity_.PHONE)),
                                                                                phone + "%")));
                        }
                        // Email
                        if (ValidationUtil.nonNull(employeeCriteria.getEmail())) {
                                employeeCriteria.getEmail()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(email -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root.get(
                                                                                                EmployeeEntity_.EMAIL)),
                                                                                email.toLowerCase() + "%")));
                        }
                        // Status
                        if (ValidationUtil.nonNull(employeeCriteria.getStatus())) {
                                employeeCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        EmployeeStatusEnum statusEnum = EmployeeStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(root
                                                                                        .get(EmployeeEntity_.STATUS),
                                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}