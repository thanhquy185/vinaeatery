package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.AllowanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.AllowanceDTO;
import vn.tuhoc.vinaeatery.domain.entity.Allowance;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailForCrud;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.AllowanceCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.AllowanceLockRequest;
import vn.tuhoc.vinaeatery.domain.request.AllowanceUpdateRequest;
import vn.tuhoc.vinaeatery.service.AllowanceDetailService;
import vn.tuhoc.vinaeatery.service.AllowanceService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/allowances")
@RequiredArgsConstructor
public class AllowanceApiController {
        // Properties
        private final AllowanceService allowanceService;
        private final AllowanceDetailService allowanceDetailService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listAllowance(@RequestBody FormSecurityDTO formSecurityDTO,
                        AllowanceCriteria allowanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "allowances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Allowance> listAllowance = this.allowanceService.getAll(allowanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listAllowance);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listAllowanceFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        AllowanceCriteria allowanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "allowances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<AllowanceDTO> listAllowance = this.allowanceService.getAllFormat(allowanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listAllowance);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailAllowance(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "allowances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Allowance allowanceSelected = this.allowanceService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(allowanceSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateAllowance(
                        @RequestBody @Valid AllowanceCreateRequest allowanceCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(allowanceCreateRequest.getFormSecurity(), "allowances",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (allowanceCreateRequest.getAllowance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu phụ cấp không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Allowance allowanceCreated = this.allowanceService.upsert(allowanceCreateRequest.getAllowance());
                if (allowanceCreated != null && allowanceCreateRequest.getAllowance().getAllowanceDetails() != null
                                && !allowanceCreateRequest.getAllowance().getAllowanceDetails().isEmpty()) {
                        for (AllowanceDetailForCrud AllowanceDetailForCrud : allowanceCreateRequest.getAllowance()
                                        .getAllowanceDetails()) {
                                AllowanceDetail newAllowanceDetail = new AllowanceDetail(
                                                new AllowanceDetailId(allowanceCreated.getId(),
                                                                AllowanceDetailForCrud.getEmployeeId(),
                                                                AllowanceDetailForCrud.getCategoryAllowanceId()));
                                this.allowanceDetailService.upsert(newAllowanceDetail);
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(allowanceCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateAllowance(@PathVariable("id") Integer id,
                        @RequestBody @Valid AllowanceUpdateRequest allowanceUpdateRequest) {
                if (!HandleFormSecurity.isValidFormData(allowanceUpdateRequest.getFormSecurity(), "allowances",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Allowance allowanceUpdated = this.allowanceService.getOneById(id);
                if (allowanceUpdated != null) {
                        allowanceUpdated.setName(allowanceUpdateRequest.getAllowance().getName());
                        allowanceUpdated.setMonth(allowanceUpdateRequest.getAllowance().getMonth());
                        allowanceUpdated.setNote(allowanceUpdateRequest.getAllowance().getNote());
                        this.allowanceService.upsert(allowanceUpdated);

                        this.allowanceDetailService.clearAllByAllowanceId(allowanceUpdated.getId());
                        List<AllowanceDetailForCrud> AllowanceDetails = allowanceUpdateRequest.getAllowance()
                                        .getAllowanceDetails();
                        if (AllowanceDetails != null && !AllowanceDetails.isEmpty()) {
                                for (AllowanceDetailForCrud allowanceDetailForCrud : AllowanceDetails) {
                                        AllowanceDetail newAllowanceDetail = new AllowanceDetail(
                                                        new AllowanceDetailId(allowanceUpdated.getId(),
                                                                        allowanceDetailForCrud.getEmployeeId(),
                                                                        allowanceDetailForCrud
                                                                                        .getCategoryAllowanceId()));
                                        this.allowanceDetailService.upsert(newAllowanceDetail);
                                }
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(allowanceUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockAllowance(@PathVariable("id") Integer id,
                        @RequestBody @Valid AllowanceLockRequest allowanceLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(allowanceLockRequest.getFormSecurity(),
                                "allowances",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (allowanceLockRequest.getAllowance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu phụ cấp không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CommonStatusEnum handleStatus = allowanceLockRequest.getAllowance()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;

                Allowance allowanceLocked = this.allowanceService.getOneById(id);
                if (allowanceLocked != null) {
                        allowanceLocked.setStatus(handleStatus);

                        this.allowanceService.lock(allowanceLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(allowanceLocked);
        }
}
