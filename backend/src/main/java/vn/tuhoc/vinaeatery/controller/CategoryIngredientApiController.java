package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.CategoryIngredientUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
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
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
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
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        CategoryIngredient categoryIngredientSelected = this.categoryIngredientService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateCategoryIngredient(
            @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("category-ingredient") @Valid CategoryIngredient categoryIngredient,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-ingredients", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CategoryIngredient categoryIngredientCreate = this.categoryIngredientService.upsert(categoryIngredient);
        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateCategoryIngredient(
            @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("category-ingredient") @Valid CategoryIngredientUpdateDTO categoryIngredient,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-ingredients", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CategoryIngredient categoryIngredientUpdated = this.categoryIngredientService.getOneById(id);
        if (categoryIngredientUpdated != null) {
            categoryIngredientUpdated.setName(categoryIngredient.getName());
            categoryIngredientUpdated.setDescription(categoryIngredient.getDescription());
            categoryIngredientUpdated.setTimeUpdate(this.timeService.getDateTimeVN(categoryIngredient.getTimeUpdate()));
            this.categoryIngredientService.upsert(categoryIngredientUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockCategoryIngredient(
            @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("category-ingredient") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-ingredients", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (ingredientService.getAllByCategoryIngredientId(id) != null
                && !ingredientService.getAllByCategoryIngredientId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(
                            "Loại nguyên liệu này đang được ít nhất 1 nguyên liệu sử dụng !"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        CategoryIngredient categoryIngredientLocked = this.categoryIngredientService.getOneById(id);
        if (categoryIngredientLocked != null) {
            categoryIngredientLocked.setStatus(handleStatus);
            categoryIngredientLocked.setTimeUpdate(handleTimeUpdate);
            this.categoryIngredientService.lock(categoryIngredientLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientLocked);
    }
}
