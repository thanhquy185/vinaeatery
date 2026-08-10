package vn.tuhoc.vinaeatery.modules.employee.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.modules.employee.services.RoleService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
        private final RoleService roleService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('ROLES__READ')")
        public ResponseEntity<RestResponseDTO<RoleDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                RoleDetailResponseDTO roleDetail = this.roleService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn chức vụ theo mã chức vụ thành công!",
                                roleDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('ROLES__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<RoleSummaryResponseDTO>>> handleGetSummary(
                        RoleCriteria RoleCriteria) {
                PageResponseDTO<RoleSummaryResponseDTO> roleSummary = this.roleService.handleGetSummary(RoleCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách chức vụ thành công!",
                                roleSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('ROLES__READ')")
        public ResponseEntity<RestResponseDTO<List<RoleCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<RoleCrudResponseDTO> roleCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.roleService.handleGetCrud(restaurantId)
                                : this.roleService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách chức vụ để xử lý thông tin thành công!",
                                roleCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('ROLES__CREATE')")
        public ResponseEntity<RestResponseDTO<RoleDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid RoleCreateRequestDTO roleCreateRequestDTO) {
                RoleDetailResponseDTO roleCreated = this.roleService.handleCreate(roleCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm chức vụ thành công!",
                                roleCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('ROLES__UPDATE')")
        public ResponseEntity<RestResponseDTO<RoleDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid RoleUpdateRequestDTO roleUpdateRequestDTO) {
                RoleDetailResponseDTO roleUpdated = this.roleService.handleUpdate(id, roleUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin chức vụ thành công!",
                                roleUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('ROLES__DELETE')")
        public ResponseEntity<RestResponseDTO<RoleDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid RoleDeleteRequestDTO roleDeleteRequestDTO) {
                RoleDetailResponseDTO roleDeleted = this.roleService.handleDelete(id, roleDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái chức vụ thành công!",
                                roleDeleted);
        }
}