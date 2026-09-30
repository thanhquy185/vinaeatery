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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.modules.employee.services.interfaces.PermissionService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
        PermissionService permissionService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('PERMISSIONS__READ')")
        public ResponseEntity<RestResponseDTO<PermissionDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                PermissionDetailResponseDTO permissionDetail = this.permissionService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn quyền hạn theo mã quyền hạn thành công!",
                                permissionDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('PERMISSIONS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<PermissionSummaryResponseDTO>>> handleGetSummary(
                        PermissionCriteria permissionCriteria) {
                PageResponseDTO<PermissionSummaryResponseDTO> permissionSummary = this.permissionService
                                .handleGetSummary(permissionCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách quyền hạn thành công!",
                                permissionSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('PERMISSIONS__READ')")
        public ResponseEntity<RestResponseDTO<List<PermissionCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<PermissionCrudResponseDTO> permissionCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.permissionService.handleGetCrud(restaurantId)
                                : this.permissionService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách quyền hạn để xử lý thông tin thành công!",
                                permissionCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('PERMISSIONS__CREATE')")
        public ResponseEntity<RestResponseDTO<PermissionDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid PermissionCreateRequestDTO permissionCreateRequestDTO) {
                PermissionDetailResponseDTO permissionCreated = this.permissionService
                                .handleCreate(permissionCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm quyền hạn thành công!",
                                permissionCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('PERMISSIONS__UPDATE')")
        public ResponseEntity<RestResponseDTO<PermissionDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid PermissionUpdateRequestDTO permissionUpdateRequestDTO) {
                PermissionDetailResponseDTO permissionUpdated = this.permissionService
                                .handleUpdate(id, permissionUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin quyền hạn thành công!",
                                permissionUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('PERMISSIONS__DELETE')")
        public ResponseEntity<RestResponseDTO<PermissionDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid PermissionDeleteRequestDTO permissionDeleteRequestDTO) {
                PermissionDetailResponseDTO permissionDeleted = this.permissionService
                                .handleDelete(id, permissionDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái quyền hạn thành công!",
                                permissionDeleted);
        }
}