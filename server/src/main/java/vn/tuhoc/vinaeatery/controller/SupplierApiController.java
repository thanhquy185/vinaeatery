package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Supplier;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.SupplierCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.SupplierLockRequest;
import vn.tuhoc.vinaeatery.domain.request.SupplierUpdateRequest;
import vn.tuhoc.vinaeatery.service.SupplierService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
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

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleCreateSupplier(@RequestBody @Valid SupplierCreateRequest supplierCreateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(supplierCreateRequest.getFormSecurity(), "suppliers", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (supplierCreateRequest.getSupplier() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu nhà cung cấp không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Supplier supplierCreate = this.supplierService.upsert(supplierCreateRequest.getSupplier());
        return ResponseEntity.status(HttpStatus.OK).body(supplierCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleUpdateSupplier(@PathVariable("id") Integer id,
            @RequestBody @Valid SupplierUpdateRequest supplierUpdateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(supplierUpdateRequest.getFormSecurity(), "suppliers", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (supplierUpdateRequest.getSupplier() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu nhà cung cấp không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Supplier supplierUpdated = this.supplierService.getOneById(id);
        if (supplierUpdated != null) {
            supplierUpdated.setName(supplierUpdateRequest.getSupplier().getName());
            supplierUpdated.setPhone(supplierUpdateRequest.getSupplier().getPhone());
            supplierUpdated.setEmail(supplierUpdateRequest.getSupplier().getEmail());
            supplierUpdated.setAddress(supplierUpdateRequest.getSupplier().getAddress());
            // supplierUpdated.setUpdateAt(this.timeService.getDateTimeVN(supplierUpdateRequest.getSupplier().getUpdateAt()));
            supplierUpdated.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));

            this.supplierService.upsert(supplierUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(supplierUpdated);
    }

    @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleLockSupplier(@PathVariable("id") Integer id,
            @RequestBody @Valid SupplierLockRequest supplierLockRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(supplierLockRequest.getFormSecurity(), "suppliers", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (supplierLockRequest.getSupplier() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu nhà cung cấp không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = supplierLockRequest.getSupplier().getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        // LocalDateTime handleUpdateAt =
        // this.timeService.getDateTimeVN(supplierLockRequest.getSupplier().getUpdateAt());
        LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(LocalDateTime.now());

        Supplier supplierLocked = this.supplierService.getOneById(id);
        if (supplierLocked != null) {
            supplierLocked.setStatus(handleStatus);
            supplierLocked.setUpdateAt(handleUpdateAt);

            this.supplierService.lock(supplierLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(supplierLocked);
    }
}