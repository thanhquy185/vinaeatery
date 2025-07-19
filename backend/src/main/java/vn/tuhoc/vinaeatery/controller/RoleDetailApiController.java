package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.RoleDetail;
import vn.tuhoc.vinaeatery.domain.criteria.RoleDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RoleDetailDTO;
import vn.tuhoc.vinaeatery.service.RoleDetailService;

@RestController
@RequestMapping("/api/role-details")
@AllArgsConstructor
public class RoleDetailApiController {
    // Properties
    private final RoleDetailService roleDetailService;

    // Methods
    @GetMapping("/list")
    public ResponseEntity<List<?>> listRoleDetail(RoleDetailCriteria roleDetailCriteria) {
        List<RoleDetail> listRoleDetail = this.roleDetailService.getAll(roleDetailCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRoleDetail);
    }

    @GetMapping("/list-format")
    public ResponseEntity<List<?>> listRoleDetailFormat(RoleDetailCriteria roleDetailCriteria) {
        List<RoleDetailDTO> listRoleDetail = this.roleDetailService.getAllFormat(roleDetailCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listRoleDetail);
    }
}