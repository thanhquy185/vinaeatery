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
import vn.tuhoc.vinaeatery.domain.criteria.CategoryInsuranceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryInsuranceCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryInsuranceLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryInsuranceUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryInsuranceService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-insurances")
@RequiredArgsConstructor
public class CategoryInsuranceApiController {
        // Properties
        private final CategoryInsuranceService categoryInsuranceService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryInsurance(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryInsuranceCriteria categoryInsuranceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-insurances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryInsurance> listCategoryInsurance = this.categoryInsuranceService
                                .getAll(categoryInsuranceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryInsurance);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryInsurance(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-insurances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryInsurance categoryInsuranceSelected = this.categoryInsuranceService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryInsuranceSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryInsurance(
                        @RequestBody @Valid CategoryInsuranceCreateRequest categoryInsuranceCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryInsuranceCreateRequest.getFormSecurity(),
                                "category-insurances", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryInsuranceCreateRequest.getCategoryInsurance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bảo hiểm không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryInsurance categoryInsuranceCreate = this.categoryInsuranceService
                                .upsert(categoryInsuranceCreateRequest.getCategoryInsurance());
                return ResponseEntity.status(HttpStatus.OK).body(categoryInsuranceCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryInsurance(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryInsuranceUpdateRequest categoryInsuranceUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryInsuranceUpdateRequest.getFormSecurity(),
                                "category-insurances", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryInsuranceUpdateRequest.getCategoryInsurance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bảo hiểm không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryInsurance categoryInsuranceUpdated = this.categoryInsuranceService.getOneById(id);
                if (categoryInsuranceUpdated != null) {
                        categoryInsuranceUpdated
                                        .setName(categoryInsuranceUpdateRequest.getCategoryInsurance().getName());
                        categoryInsuranceUpdated
                                        .setCompanyPercent(categoryInsuranceUpdateRequest.getCategoryInsurance()
                                                        .getCompanyPercent());
                        categoryInsuranceUpdated
                                        .setEmployeePercent(categoryInsuranceUpdateRequest.getCategoryInsurance()
                                                        .getEmployeePercent());
                        categoryInsuranceUpdated
                                        .setDescription(categoryInsuranceUpdateRequest.getCategoryInsurance()
                                                        .getDescription());

                        this.categoryInsuranceService.upsert(categoryInsuranceUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryInsuranceUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryInsurance(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryInsuranceLockRequest categoryInsuranceLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryInsuranceLockRequest.getFormSecurity(),
                                "category-insurances",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryInsuranceLockRequest.getCategoryInsurance() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bảo hiểm không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                // List<Insurance> categoryInsuranceListIsUsing =
                // InsuranceService.getAllByCategoryInsuranceId(id);
                // if (categoryInsuranceListIsUsing != null &&
                // !categoryInsuranceListIsUsing.isEmpty()) {
                // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                // .body(ValidationUtil.buildRestResponseWithStr(
                // "Loại bảo hiểm này đang được ít nhất 1 nguyên liệu sử dụng!"));
                // }

                CommonStatusEnum handleStatus = categoryInsuranceLockRequest.getCategoryInsurance()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;

                CategoryInsurance categoryInsuranceLocked = this.categoryInsuranceService.getOneById(id);
                if (categoryInsuranceLocked != null) {
                        categoryInsuranceLocked.setStatus(handleStatus);
                        
                        this.categoryInsuranceService.lock(categoryInsuranceLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryInsuranceLocked);
        }
}
