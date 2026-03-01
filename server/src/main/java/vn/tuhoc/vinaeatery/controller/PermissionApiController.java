package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
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
import vn.tuhoc.vinaeatery.domain.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.PermissionDTO;
import vn.tuhoc.vinaeatery.domain.dto.PermissionUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.Permission;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetailForCrud;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetailId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.PermissionDetailService;
import vn.tuhoc.vinaeatery.service.PermissionService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionApiController {
    // Properties
    private final PermissionService permissionService;
    private final PermissionDetailService permissionDetailService;
    // private final EmployeeService employeeService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listPermission(@RequestBody FormSecurityDTO formSecurityDTO,
            PermissionCriteria permissionCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Permission> listPermission = this.permissionService.getAll(permissionCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listPermission);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listPermissionFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            PermissionCriteria permissionCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<PermissionDTO> listPermission = this.permissionService.getAllFormat(permissionCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listPermission);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailPermission(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Permission permissionSelected = this.permissionService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(permissionSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreatePermission(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("permission") @Valid Permission permission, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Permission permissionCreated = this.permissionService.upsert(permission);
        if (permissionCreated != null) {
            List<PermissionDetailForCrud> permissionDetails = permission.getPermissionDetails();
            if (permissionDetails != null && !permissionDetails.isEmpty()) {
                for (PermissionDetailForCrud PermissionDetailForCrud : permissionDetails) {
                    PermissionDetail newPermissionDetail = new PermissionDetail(
                            new PermissionDetailId(permissionCreated.getId(), PermissionDetailForCrud.getFunctionId(),
                                    PermissionDetailForCrud.getAction()));
                    this.permissionDetailService.upsert(newPermissionDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(permissionCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdatePermission(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("permission") @Valid PermissionUpdateDTO permission,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Permission permissionUpdated = this.permissionService.getOneById(id);
        if (permissionUpdated != null) {
            permissionUpdated.setName(permission.getName());
            permissionUpdated.setUpdateAt(permission.getUpdateAt());
            this.permissionService.upsert(permissionUpdated);

            this.permissionDetailService.clearAllByPermissionId(permissionUpdated.getId());
            List<PermissionDetailForCrud> permissionDetails = permission.getPermissionDetails();
            if (permissionDetails != null && !permissionDetails.isEmpty()) {
                for (PermissionDetailForCrud permissionDetailForCrud : permissionDetails) {
                    PermissionDetail newPermissionDetail = new PermissionDetail(
                            new PermissionDetailId(permissionUpdated.getId(), permissionDetailForCrud.getFunctionId(),
                                    permissionDetailForCrud.getAction()));
                    this.permissionDetailService.upsert(newPermissionDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(permissionUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockPermission(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("permission") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permissions", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        // LocalDateTime handleUpdateAt =
        // this.timeService.getDateTimeVN(commonStatusUpdate.getUpdateAt());

        Permission PermissionLocked = this.permissionService.getOneById(id);
        if (PermissionLocked != null) {
            PermissionLocked.setStatus(handleStatus);
            // PermissionLocked.setUpdateAt(handleUpdateAt);
            this.permissionService.lock(PermissionLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(PermissionLocked);
    }
}