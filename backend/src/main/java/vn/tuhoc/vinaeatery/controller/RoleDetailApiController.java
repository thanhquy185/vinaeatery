package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RoleDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.RoleDetail;
import vn.tuhoc.vinaeatery.service.RoleDetailService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/role-details")
@RequiredArgsConstructor
public class RoleDetailApiController {
    // Properties
    private final RoleDetailService roleDetailService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listRoleDetail(@RequestBody FormSecurityDTO formSecurityDTO,
            RoleDetailCriteria roleDetailCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "role-details", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<RoleDetail> listRoleDetail = this.roleDetailService.getAll(roleDetailCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRoleDetail);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listRoleDetailFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            RoleDetailCriteria roleDetailCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "role-details", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<RoleDetailDTO> listRoleDetail = this.roleDetailService.getAllFormat(roleDetailCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRoleDetail);
    }
}