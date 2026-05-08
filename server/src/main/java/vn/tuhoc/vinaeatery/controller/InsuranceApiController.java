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
import vn.tuhoc.vinaeatery.domain.criteria.InsuranceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.InsuranceDTO;
import vn.tuhoc.vinaeatery.domain.entity.Insurance;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailForCrud;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.InsuranceCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.InsuranceLockRequest;
import vn.tuhoc.vinaeatery.domain.request.InsuranceUpdateRequest;
import vn.tuhoc.vinaeatery.service.InsuranceDetailService;
import vn.tuhoc.vinaeatery.service.InsuranceService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/insurances")
@RequiredArgsConstructor
public class InsuranceApiController {
    // Properties
    private final InsuranceService insuranceService;
    private final InsuranceDetailService insuranceDetailService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listInsurance(@RequestBody FormSecurityDTO formSecurityDTO,
            InsuranceCriteria InsuranceCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "insurances", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Insurance> listInsurance = this.insuranceService.getAll(InsuranceCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listInsurance);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listInsuranceFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            InsuranceCriteria InsuranceCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "insurances", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<InsuranceDTO> listInsurance = this.insuranceService.getAllFormat(InsuranceCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listInsurance);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailInsurance(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "insurances", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Insurance InsuranceSelected = this.insuranceService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(InsuranceSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleCreateInsurance(
            @RequestBody @Valid InsuranceCreateRequest insuranceCreateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(insuranceCreateRequest.getFormSecurity(), "insurances",
                "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }
        if (insuranceCreateRequest.getInsurance() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu bảo hiểm không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Insurance insuranceCreated = this.insuranceService.upsert(insuranceCreateRequest.getInsurance());
        if (insuranceCreated != null && insuranceCreateRequest.getInsurance().getInsuranceDetails() != null
                && !insuranceCreateRequest.getInsurance().getInsuranceDetails().isEmpty()) {
            for (InsuranceDetailForCrud insuranceDetailForCrud : insuranceCreateRequest.getInsurance()
                    .getInsuranceDetails()) {
                InsuranceDetail newInsuranceDetail = new InsuranceDetail(
                        new InsuranceDetailId(insuranceCreated.getId(),
                                insuranceDetailForCrud.getEmployeeId(),
                                insuranceDetailForCrud.getCategoryInsuranceId()));
                this.insuranceDetailService.upsert(newInsuranceDetail);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(insuranceCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleUpdateInsurance(@PathVariable("id") Integer id,
            @RequestBody @Valid InsuranceUpdateRequest insuranceUpdateRequest) {
        if (!HandleFormSecurity.isValidFormData(insuranceUpdateRequest.getFormSecurity(), "insurances",
                "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Insurance insuranceUpdated = this.insuranceService.getOneById(id);
        if (insuranceUpdated != null) {
            insuranceUpdated.setName(insuranceUpdateRequest.getInsurance().getName());
            insuranceUpdated.setMonth(insuranceUpdateRequest.getInsurance().getMonth());
            insuranceUpdated.setNote(insuranceUpdateRequest.getInsurance().getNote());
            this.insuranceService.upsert(insuranceUpdated);

            this.insuranceDetailService.clearAllByInsuranceId(insuranceUpdated.getId());
            List<InsuranceDetailForCrud> insuranceDetails = insuranceUpdateRequest.getInsurance().getInsuranceDetails();
            if (insuranceDetails != null && !insuranceDetails.isEmpty()) {
                for (InsuranceDetailForCrud insuranceDetailForCrud : insuranceDetails) {
                    InsuranceDetail newInsuranceDetail = new InsuranceDetail(
                            new InsuranceDetailId(insuranceUpdated.getId(),
                                    insuranceDetailForCrud.getEmployeeId(),
                                    insuranceDetailForCrud.getCategoryInsuranceId()));
                    this.insuranceDetailService.upsert(newInsuranceDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(insuranceUpdated);
    }

    @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleLockInsurance(@PathVariable("id") Integer id,
            @RequestBody @Valid InsuranceLockRequest insuranceLockRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(insuranceLockRequest.getFormSecurity(),
                "insurances",
                "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity
                                    .getErrorMessageByHandleFormData()));
        }

        if (insuranceLockRequest.getInsurance() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(
                                    "Dữ liệu bảo hiểm không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = insuranceLockRequest.getInsurance()
                .getStatus() == CommonStatusEnum.ACTIVE
                        ? CommonStatusEnum.INACTIVE
                        : CommonStatusEnum.ACTIVE;

        Insurance insuranceLocked = this.insuranceService.getOneById(id);
        if (insuranceLocked != null) {
            insuranceLocked.setStatus(handleStatus);

            this.insuranceService.lock(insuranceLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(insuranceLocked);
    }
}
