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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.modules.employee.services.EmployeeServiceImplement;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeController {
        final EmployeeServiceImplement employeeService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('EMPLOYEES__READ')")
        public ResponseEntity<RestResponseDTO<EmployeeDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                EmployeeDetailResponseDTO employeeDetail = this.employeeService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn nhân viên theo mã nhân viên thành công!",
                                employeeDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('EMPLOYEES__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<EmployeeSummaryResponseDTO>>> handleGetSummary(
                        EmployeeCriteria EmployeeCriteria) {
                PageResponseDTO<EmployeeSummaryResponseDTO> employeeSummary = this.employeeService
                                .handleGetSummary(EmployeeCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhân viên thành công!",
                                employeeSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('EMPLOYEES__READ')")
        public ResponseEntity<RestResponseDTO<List<EmployeeCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<EmployeeCrudResponseDTO> employeeCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.employeeService.handleGetCrud(restaurantId)
                                : this.employeeService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhân viên để xử lý thông tin thành công!",
                                employeeCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('EMPLOYEES__CREATE')")
        public ResponseEntity<RestResponseDTO<EmployeeDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("employee") @Valid EmployeeCreateRequestDTO employeeCreateRequestDTO) {
                EmployeeDetailResponseDTO employeeCreated = this.employeeService.handleCreate(
                                imageFile,
                                employeeCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm nhân viên thành công!",
                                employeeCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('EMPLOYEES__UPDATE')")
        public ResponseEntity<RestResponseDTO<EmployeeDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("employee") @Valid EmployeeUpdateRequestDTO employeeUpdateRequestDTO) {
                EmployeeDetailResponseDTO employeeUpdated = this.employeeService.handleUpdate(
                                id,
                                imageFile,
                                employeeUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin nhân viên thành công!",
                                employeeUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('EMPLOYEES__DELETE')")
        public ResponseEntity<RestResponseDTO<EmployeeDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid EmployeeDeleteRequestDTO employeeDeleteRequestDTO) {
                EmployeeDetailResponseDTO employeeDeleted = this.employeeService.handleDelete(
                                id,
                                employeeDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái nhân viên thành công!",
                                employeeDeleted);
        }
}