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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.SalaryAdvanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.SalaryAdvanceDTO;
import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance;
import vn.tuhoc.vinaeatery.domain.request.SalaryAdvanceCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.SalaryAdvanceUpdateRequest;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.SalaryAdvanceService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/salary-advances")
@RequiredArgsConstructor
public class SalaryAdvanceApiController {
        // Properties
        private final SalaryAdvanceService salaryAdvanceService;
        // private final EmployeeService employeeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listSalaryAdvance(@RequestBody FormSecurityDTO formSecurityDTO,
                        SalaryAdvanceCriteria salaryAdvanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "salary-advances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<SalaryAdvance> listSalaryAdvance = this.salaryAdvanceService.getAll(salaryAdvanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listSalaryAdvance);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listSalaryAdvanceFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        SalaryAdvanceCriteria salaryAdvanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "salary-advances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<SalaryAdvanceDTO> listSalaryAdvance = this.salaryAdvanceService
                                .getAllFormat(salaryAdvanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listSalaryAdvance);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailSalaryAdvance(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "salary-advances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                SalaryAdvance salaryAdvanceSelected = this.salaryAdvanceService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(salaryAdvanceSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateSalaryAdvance(
                        @RequestBody @Valid SalaryAdvanceCreateRequest salaryAdvanceCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(salaryAdvanceCreateRequest.getFormSecurity(),
                                "salary-advances",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (salaryAdvanceCreateRequest.getSalaryAdvance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu phiếu nhập không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                SalaryAdvance salaryAdvanceCreated = this.salaryAdvanceService
                                .upsert(salaryAdvanceCreateRequest.getSalaryAdvance());

                return ResponseEntity.status(HttpStatus.OK).body(salaryAdvanceCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateSalaryAdvance(@PathVariable("id") Integer id,
                        @RequestBody @Valid SalaryAdvanceUpdateRequest salaryAdvanceUpdateRequest) {
                if (!HandleFormSecurity.isValidFormData(salaryAdvanceUpdateRequest.getFormSecurity(),
                                "salary-advances",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                SalaryAdvance salaryAdvanceUpdated = this.salaryAdvanceService.getOneById(id);
                // if (salaryAdvanceUpdateRequest.getSalaryAdvance().getEmployeeHandleId() !=
                // null) {
                // salaryAdvanceUpdated
                // .setEmployeeHandleId(salaryAdvanceUpdateRequest.getSalaryAdvance()
                // .getEmployeeHandleId());
                // }
                if (salaryAdvanceUpdateRequest.getSalaryAdvance().getStatus() != null) {
                        salaryAdvanceUpdated.setStatus(salaryAdvanceUpdateRequest.getSalaryAdvance().getStatus());
                }
                this.salaryAdvanceService.upsert(salaryAdvanceUpdated);

                return ResponseEntity.status(HttpStatus.OK).body(salaryAdvanceUpdated);
        }
}
