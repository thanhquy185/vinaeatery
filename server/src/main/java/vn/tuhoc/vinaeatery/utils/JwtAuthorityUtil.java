package vn.tuhoc.vinaeatery.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.FunctionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.repositories.EmployeeRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.FunctionRepository;

@Service
@RequiredArgsConstructor
public class JwtAuthorityUtil {
    private final FunctionRepository functionRepository;
    private final EmployeeRepository employeeRepository;

    private String handleAction(String action) {
        if (action.equalsIgnoreCase("Xem")) {
            return "READ";
        } else if (action.equalsIgnoreCase("Thêm")) {
            return "CREATE";
        } else if (action.equalsIgnoreCase("Cập nhật")) {
            return "UPDATE";
        } else if (action.equalsIgnoreCase("Khóa")) {
            return "DELETE";
        }

        return null;
    }

    private String handleAuthority(String functionNameEN, String action) {
        return String.format(
                "%s__%s",
                functionNameEN.toUpperCase().replace("-", "_"),
                this.handleAction(action));
    }

    public List<String> generateAuthorities(Boolean isManager, Integer userId) {
        List<String> authorities = new ArrayList<>();

        // Manager
        if (isManager) {
            List<FunctionEntity> functionEntities = this.functionRepository.findAll();
            for (FunctionEntity functionEntity : functionEntities) {
                String[] actions = functionEntity.getActions().split("\\|");
                for (String action : actions) {
                    authorities.add(this.handleAuthority(functionEntity.getNameEN(), action));
                }
            }

            return authorities;
        }

        // Employee
        Optional<EmployeeEntity> employeeEntityOption = this.employeeRepository.findOneByUserId(userId);
        List<PermissionDetailEntity> permissionDetailEntities = employeeEntityOption.isPresent()
                ? employeeEntityOption.get().getPermission().getPermissionDetails()
                : null;
        if (ValidationUtil.nonNull(permissionDetailEntities) && !permissionDetailEntities.isEmpty()) {
            for (PermissionDetailEntity permissionDetailEntity : permissionDetailEntities) {
                authorities.add(this.handleAuthority(
                        permissionDetailEntity.getFunction().getNameEN(),
                        permissionDetailEntity.getId().getAction()));
            }
        }

        return authorities;
    }
}
