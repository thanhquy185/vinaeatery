package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Role;
import vn.tuhoc.vinaeatery.domain.RoleDetail;
import vn.tuhoc.vinaeatery.domain.RoleDetailForCrud;
import vn.tuhoc.vinaeatery.domain.RoleDetailId;
import vn.tuhoc.vinaeatery.domain.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.RoleDetailService;
import vn.tuhoc.vinaeatery.service.RoleHistoryService;
import vn.tuhoc.vinaeatery.service.RoleService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/roles")
@AllArgsConstructor
public class RoleApiController {
    // Properties
    private final RoleService roleService;
    private final RoleDetailService roleDetailService;
    private final RoleHistoryService roleHistoryService;
    // private final EmployeeService employeeService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listRole(@RequestBody @Valid FormGetDataDTO formGetDataDTO, RoleCriteria roleCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<Role> listRole = this.roleService.getAll(roleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRole);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listRoleFormat(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            RoleCriteria roleCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<RoleDTO> listRole = this.roleService.getAllFormat(roleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRole);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailRole(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        Role roleSelected = this.roleService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(roleSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateRole(@RequestBody @Valid Role role, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Role roleCreated = this.roleService.upsert(role);
        if (roleCreated != null) {
            List<RoleDetailForCrud> roleDetails = role.getRoleDetails();
            if (roleDetails != null && !roleDetails.isEmpty()) {
                for (RoleDetailForCrud roleDetailForCrud : roleDetails) {
                    RoleDetail newRoleDetail = new RoleDetail(
                            new RoleDetailId(roleCreated.getId(), roleDetailForCrud.getFunctionId(),
                                    roleDetailForCrud.getAction()));
                    roleDetailService.upsert(newRoleDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleCreated);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdate(@PathVariable("id") Integer id,
            @RequestBody @Valid RoleUpdateDTO role,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Role roleUpdated = this.roleService.getOneById(id);
        if (roleUpdated != null) {
            roleUpdated.setName(role.getName());
            roleUpdated.setSalary(role.getSalary());
            roleUpdated.setTimeUpdate(this.timeService.getDateTimeVN(role.getTimeUpdate()));
            this.roleService.upsert(roleUpdated);

            roleDetailService.clearAllByRoleId(roleUpdated.getId());
            List<RoleDetailForCrud> roleDetails = role.getRoleDetails();
            if (roleDetails != null && !roleDetails.isEmpty()) {
                for (RoleDetailForCrud roleDetailForCrud : roleDetails) {
                    RoleDetail newRoleDetail = new RoleDetail(
                            new RoleDetailId(roleUpdated.getId(), roleDetailForCrud.getFunctionId(),
                                    roleDetailForCrud.getAction()));
                    roleDetailService.upsert(newRoleDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLock(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (roleHistoryService.getAllByRoleId(id) != null && !roleHistoryService.getAllByRoleId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr("Chức vụ này đang được ít nhất 1 nhân viên sử dụng !"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        Role roleLocked = this.roleService.getOneById(id);
        if (roleLocked != null) {
            roleLocked.setStatus(handleStatus);
            roleLocked.setTimeUpdate(handleTimeUpdate);
            this.roleService.lock(roleLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(roleLocked);
    }
}