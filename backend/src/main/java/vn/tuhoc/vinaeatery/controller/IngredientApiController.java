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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.IngredientDTO;
import vn.tuhoc.vinaeatery.domain.dto.IngredientUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientApiController {
    // Properties
    private final IngredientService ingredientService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listIngredient(@RequestBody FormSecurityDTO formSecurityDTO,
            IngredientCriteria ingredientCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Ingredient> listIngredient = this.ingredientService.getAll(ingredientCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listIngredient);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listIngredientFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            IngredientCriteria ingredientCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<IngredientDTO> listIngredientFormat = this.ingredientService.getAllFormat(ingredientCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listIngredientFormat);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailIngredient(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Ingredient ingredientSelected = this.ingredientService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(ingredientSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateIngredient(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("ingredient") @Valid Ingredient ingredient,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Ingredient ingredientCreate = this.ingredientService.upsert(ingredient);
        return ResponseEntity.status(HttpStatus.OK).body(ingredientCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateIngredient(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("ingredient") @Valid IngredientUpdateDTO ingredient,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Ingredient ingredientUpdated = this.ingredientService.getOneById(id);
        if (ingredientUpdated != null) {
            ingredientUpdated.setName(ingredient.getName());
            ingredientUpdated.setCategoryIngredientId(ingredient.getCategoryIngredientId());
            ingredientUpdated.setUnit(ingredient.getUnit());
            ingredientUpdated.setCapacity(ingredient.getCapacity());
            ingredientUpdated.setDateCreate(ingredient.getDateCreate());
            ingredientUpdated.setDateRemove(ingredient.getDateRemove());
            ingredientUpdated.setInputPrice(ingredient.getInputPrice());
            ingredientUpdated.setNote(ingredient.getNote());
            ingredientUpdated.setTimeUpdate(this.timeService.getDateTimeVN(ingredient.getTimeUpdate()));
            this.ingredientService.upsert(ingredientUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(ingredientUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockIngredient(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("ingredient") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "lock")) {
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

        Ingredient ingredientLocked = this.ingredientService.getOneById(id);
        if (ingredientLocked != null) {
            ingredientLocked.setStatus(handleStatus);
            ingredientLocked.setTimeUpdate(handleTimeUpdate);
            this.ingredientService.lock(ingredientLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(ingredientLocked);
    }
}