package vn.tuhoc.vinaeatery.controller;

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
import vn.tuhoc.vinaeatery.domain.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.IngredientDTO;
import vn.tuhoc.vinaeatery.domain.entity.Ingredient;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.IngredientCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.IngredientLockRequest;
import vn.tuhoc.vinaeatery.domain.request.IngredientUpdateRequest;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientApiController {
        // Properties
        private final IngredientService ingredientService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listIngredient(@RequestBody FormSecurityDTO formSecurityDTO,
                        IngredientCriteria ingredientCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "ingredients", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
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
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
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
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Ingredient ingredientSelected = this.ingredientService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(ingredientSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateIngredient(
                        @RequestBody @Valid IngredientCreateRequest ingredientCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(ingredientCreateRequest.getFormSecurity(), "ingredients",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (ingredientCreateRequest.getIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Ingredient ingredientCreate = this.ingredientService.upsert(ingredientCreateRequest.getIngredient());
                return ResponseEntity.status(HttpStatus.OK).body(ingredientCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateIngredient(@PathVariable("id") Integer id,
                        @RequestBody @Valid IngredientUpdateRequest ingredientUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(ingredientUpdateRequest.getFormSecurity(), "ingredients",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (ingredientUpdateRequest.getIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Ingredient ingredientUpdated = this.ingredientService.getOneById(id);
                if (ingredientUpdated != null) {
                        ingredientUpdated.setName(ingredientUpdateRequest.getIngredient().getName());
                        ingredientUpdated
                                        .setCategoryIngredientId(ingredientUpdateRequest.getIngredient()
                                                        .getCategoryIngredientId());
                        ingredientUpdated.setUnit(ingredientUpdateRequest.getIngredient().getUnit());
                        ingredientUpdated.setCapacity(ingredientUpdateRequest.getIngredient().getCapacity());
                        ingredientUpdated.setDateCreate(ingredientUpdateRequest.getIngredient().getDateCreate());
                        ingredientUpdated.setDateRemove(ingredientUpdateRequest.getIngredient().getDateRemove());
                        ingredientUpdated.setInputPrice(ingredientUpdateRequest.getIngredient().getInputPrice());
                        ingredientUpdated.setNote(ingredientUpdateRequest.getIngredient().getNote());

                        this.ingredientService.upsert(ingredientUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(ingredientUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockIngredient(@PathVariable("id") Integer id,
                        @RequestBody @Valid IngredientLockRequest ingredientLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(ingredientLockRequest.getFormSecurity(), "ingredients",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (ingredientLockRequest.getIngredient() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CommonStatusEnum handleStatus = ingredientLockRequest.getIngredient()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;

                Ingredient ingredientLocked = this.ingredientService.getOneById(id);
                if (ingredientLocked != null) {
                        ingredientLocked.setStatus(handleStatus);

                        this.ingredientService.lock(ingredientLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(ingredientLocked);
        }
}