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
import vn.tuhoc.vinaeatery.domain.criteria.CategoryAllowanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryAllowanceCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryAllowanceLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryAllowanceUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryAllowanceService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-allowances")
@RequiredArgsConstructor
public class CategoryAllowanceApiController {
        // Properties
        private final CategoryAllowanceService categoryAllowanceService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryAllowance(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryAllowanceCriteria categoryAllowanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-allowances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryAllowance> listCategoryAllowance = this.categoryAllowanceService
                                .getAll(categoryAllowanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryAllowance);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryAllowance(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-allowances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryAllowance categoryAllowanceSelected = this.categoryAllowanceService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryAllowanceSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryAllowance(
                        @RequestBody @Valid CategoryAllowanceCreateRequest categoryAllowanceCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryAllowanceCreateRequest.getFormSecurity(),
                                "category-allowances", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryAllowanceCreateRequest.getCategoryAllowance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại phụ cấp không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryAllowance categoryAllowanceCreate = this.categoryAllowanceService
                                .upsert(categoryAllowanceCreateRequest.getCategoryAllowance());
                return ResponseEntity.status(HttpStatus.OK).body(categoryAllowanceCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryAllowance(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryAllowanceUpdateRequest categoryAllowanceUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryAllowanceUpdateRequest.getFormSecurity(),
                                "category-allowances", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryAllowanceUpdateRequest.getCategoryAllowance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại phụ cấp không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryAllowance categoryAllowanceUpdated = this.categoryAllowanceService.getOneById(id);
                if (categoryAllowanceUpdated != null) {
                        categoryAllowanceUpdated
                                        .setName(categoryAllowanceUpdateRequest.getCategoryAllowance().getName());
                        categoryAllowanceUpdated
                                        .setMoney(categoryAllowanceUpdateRequest.getCategoryAllowance()
                                                        .getMoney());
                        categoryAllowanceUpdated
                                        .setDescription(categoryAllowanceUpdateRequest.getCategoryAllowance()
                                                        .getDescription());

                        this.categoryAllowanceService.upsert(categoryAllowanceUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryAllowanceUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryAllowance(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryAllowanceLockRequest categoryAllowanceLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryAllowanceLockRequest.getFormSecurity(),
                                "category-allowances",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryAllowanceLockRequest.getCategoryAllowance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại phụ cấp không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                // List<Allowance> categoryAllowanceListIsUsing =
                // AllowanceService.getAllByCategoryAllowanceId(id);
                // if (categoryAllowanceListIsUsing != null &&
                // !categoryAllowanceListIsUsing.isEmpty()) {
                // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                // .body(ValidationUtil.buildRestResponseWithStr(
                // "Loại phụ cấp này đang được ít nhất 1 nguyên liệu sử dụng!"));
                // }

                CommonStatusEnum handleStatus = categoryAllowanceLockRequest.getCategoryAllowance()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;

                CategoryAllowance categoryAllowanceLocked = this.categoryAllowanceService.getOneById(id);
                if (categoryAllowanceLocked != null) {
                        categoryAllowanceLocked.setStatus(handleStatus);

                        this.categoryAllowanceService.lock(categoryAllowanceLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryAllowanceLocked);
        }
}
