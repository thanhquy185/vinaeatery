package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Supplier;
import vn.tuhoc.vinaeatery.domain.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.SupplierUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.SupplierService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/suppliers")
@AllArgsConstructor
public class SupplierApiController {
    // Properties
    private final SupplierService supplierService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listSupplier(@RequestBody FormSecurityDTO formSecurityDTO,
            SupplierCriteria SupplierCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "suppliers", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Supplier> listSupplier = this.supplierService.getAll(SupplierCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listSupplier);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailSupplier(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "suppliers", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Supplier supplierSelected = this.supplierService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(supplierSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateSupplier(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("supplier") @Valid Supplier supplier, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "suppliers", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Supplier supplierCreate = this.supplierService.upsert(supplier);
        return ResponseEntity.status(HttpStatus.OK).body(supplierCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateSupplier(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("supplier") @Valid SupplierUpdateDTO supplier,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "suppliers", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Supplier supplierUpdated = this.supplierService.getOneById(id);
        if (supplierUpdated != null) {
            supplierUpdated.setName(supplier.getName());
            supplierUpdated.setPhone(supplier.getPhone());
            supplierUpdated.setEmail(supplier.getEmail());
            supplierUpdated.setAddress(supplier.getAddress());
            supplierUpdated.setTimeUpdate(this.timeService.getDateTimeVN(supplier.getTimeUpdate()));
            this.supplierService.upsert(supplierUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(supplierUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockSupplier(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("supplier") @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "suppliers", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        Supplier supplierLocked = this.supplierService.getOneById(id);
        if (supplierLocked != null) {
            supplierLocked.setStatus(handleStatus);
            supplierLocked.setTimeUpdate(handleTimeUpdate);
            this.supplierService.lock(supplierLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(supplierLocked);
    }
}