package vn.tuhoc.vinaeatery.modules.food.controllers;

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
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.SupplierService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {
        SupplierService supplierService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('SUPPLIERS__READ')")
        public ResponseEntity<RestResponseDTO<SupplierDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                SupplierDetailResponseDTO supplierDetail = this.supplierService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn nhà cung cấp theo mã nhà cung cấp thành công!",
                                supplierDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('SUPPLIERS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<SupplierSummaryResponseDTO>>> handleGetSummary(
                        SupplierCriteria supplierCriteria) {
                PageResponseDTO<SupplierSummaryResponseDTO> supplierSummary = this.supplierService
                                .handleGetSummary(supplierCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà cung cấp thành công!",
                                supplierSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('SUPPLIERS__READ')")
        public ResponseEntity<RestResponseDTO<List<SupplierCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<SupplierCrudResponseDTO> supplierCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.supplierService.handleGetCrud(restaurantId)
                                : this.supplierService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà cung cấp để xử lý thông tin thành công!",
                                supplierCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('SUPPLIERS__CREATE')")
        public ResponseEntity<RestResponseDTO<SupplierDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid SupplierCreateRequestDTO supplierCreateRequestDTO) {
                SupplierDetailResponseDTO supplierCreated = this.supplierService.handleCreate(supplierCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm nhà cung cấp thành công!",
                                supplierCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('SUPPLIERS__UPDATE')")
        public ResponseEntity<RestResponseDTO<SupplierDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid SupplierUpdateRequestDTO supplierUpdateRequestDTO) {
                SupplierDetailResponseDTO supplierUpdated = this.supplierService.handleUpdate(
                                id,
                                supplierUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin nhà cung cấp thành công!",
                                supplierUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('SUPPLIERS__DELETE')")
        public ResponseEntity<RestResponseDTO<SupplierDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid SupplierDeleteRequestDTO supplierDeleteRequestDTO) {
                SupplierDetailResponseDTO supplierDeleted = this.supplierService.handleDelete(
                                id,
                                supplierDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái nhà cung cấp thành công!",
                                supplierDeleted);
        }
}