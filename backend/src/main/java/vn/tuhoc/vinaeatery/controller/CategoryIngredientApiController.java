package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
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
import vn.tuhoc.vinaeatery.domain.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.entity.Ingredient;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryIngredientCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryIngredientLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryIngredientUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryIngredientService;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-ingredients")
@RequiredArgsConstructor
public class CategoryIngredientApiController {
        // Properties
        private final CategoryIngredientService categoryIngredientService;
        private final IngredientService ingredientService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryIngredient(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryIngredientCriteria categoryIngredientCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-ingredients", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryIngredient> listCategoryIngredient = this.categoryIngredientService
                                .getAll(categoryIngredientCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryIngredient);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryIngredient(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-ingredients", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryIngredient categoryIngredientSelected = this.categoryIngredientService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryIngredient(
                        @RequestBody @Valid CategoryIngredientCreateRequest categoryIngredientCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryIngredientCreateRequest.getFormSecurity(),
                                "category-ingredients", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryIngredientCreateRequest.getCategoryIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryIngredient categoryIngredientCreate = this.categoryIngredientService
                                .upsert(categoryIngredientCreateRequest.getCategoryIngredient());
                return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryIngredient(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryIngredientUpdateRequest categoryIngredientUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryIngredientUpdateRequest.getFormSecurity(),
                                "category-ingredients", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryIngredientUpdateRequest.getCategoryIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryIngredient categoryIngredientUpdated = this.categoryIngredientService.getOneById(id);
                if (categoryIngredientUpdated != null) {
                        categoryIngredientUpdated
                                        .setName(categoryIngredientUpdateRequest.getCategoryIngredient().getName());
                        categoryIngredientUpdated
                                        .setDescription(categoryIngredientUpdateRequest.getCategoryIngredient()
                                                        .getDescription());
                        // categoryIngredientUpdated.setUpdateAt(this.timeService.getDateTimeVN(categoryIngredientUpdateRequest.getCategoryIngredient().getUpdateAt()));
                        categoryIngredientUpdated.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));

                        this.categoryIngredientService.upsert(categoryIngredientUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryIngredient(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryIngredientLockRequest categoryIngredientLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryIngredientLockRequest.getFormSecurity(),
                                "category-ingredients",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryIngredientLockRequest.getCategoryIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                List<Ingredient> categoryIngredientListIsUsing = ingredientService.getAllByCategoryIngredientId(id);
                if (categoryIngredientListIsUsing != null && !categoryIngredientListIsUsing.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Loại nguyên liệu này đang được ít nhất 1 nguyên liệu sử dụng !"));
                }

                CommonStatusEnum handleStatus = categoryIngredientLockRequest.getCategoryIngredient()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt = this.serviceAt
                // .getDateTimeVN(categoryIngredientLockRequest.getCategoryIngredient().getUpdateAt());
                LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(LocalDateTime.now());

                CategoryIngredient categoryIngredientLocked = this.categoryIngredientService.getOneById(id);
                if (categoryIngredientLocked != null) {
                        categoryIngredientLocked.setStatus(handleStatus);
                        categoryIngredientLocked.setUpdateAt(handleUpdateAt);

                        this.categoryIngredientService.lock(categoryIngredientLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientLocked);
        }
}
