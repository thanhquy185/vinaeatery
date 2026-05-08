package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.Role;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.RoleHistoryService;
import vn.tuhoc.vinaeatery.service.RoleService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleApiController {
    // Properties
    private final RoleService roleService;
    private final RoleHistoryService roleHistoryService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listRole(@RequestBody FormSecurityDTO formSecurityDTO, RoleCriteria roleCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Role> listRole = this.roleService.getAll(roleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRole);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listRoleFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            RoleCriteria roleCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<RoleDTO> listRole = this.roleService.getAllFormat(roleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRole);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailRole(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Role roleSelected = this.roleService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(roleSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateRole(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("role") @Valid Role role, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }
        Role roleCreated = this.roleService.upsert(role);

        return ResponseEntity.status(HttpStatus.OK).body(roleCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateRole(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("role") @Valid RoleUpdateDTO role,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Role roleUpdated = this.roleService.getOneById(id);
        if (roleUpdated != null) {
            roleUpdated.setName(role.getName());
            roleUpdated.setSalaryType(role.getSalaryType());
            roleUpdated.setSalaryValue(role.getSalaryValue());
            // roleUpdated.setUpdateAt(this.timeService.getDateTimeVN(role.getUpdateAt()));
            this.roleService.upsert(roleUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockRole(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("role") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "roles", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (roleHistoryService.getAllByRoleId(id) != null && !roleHistoryService.getAllByRoleId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Chức vụ này đang được ít nhất 1 nhân viên sử dụng!"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;

        Role roleLocked = this.roleService.getOneById(id);
        if (roleLocked != null) {
            roleLocked.setStatus(handleStatus);
            
            this.roleService.lock(roleLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleLocked);
    }
}