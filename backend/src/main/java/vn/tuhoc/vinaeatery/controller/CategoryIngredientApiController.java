package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CategoryIngredientUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CategoryIngredientService;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-ingredients")
@AllArgsConstructor
public class CategoryIngredientApiController {
    // Properties
    private final CategoryIngredientService categoryIngredientService;
    private final IngredientService ingredientService;
    private final TimeService timeService;

    // Methods
    @GetMapping("/list")
    public ResponseEntity<List<?>> listCategoryIngredient(CategoryIngredientCriteria categoryIngredientCriteria) {
        List<CategoryIngredient> listCategoryIngredient = this.categoryIngredientService
                .getAll(categoryIngredientCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCategoryIngredient);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailCategoryIngredient(@PathVariable("id") Integer id) {
        CategoryIngredient categoryIngredientSelected = this.categoryIngredientService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateCategoryIngredient(@RequestBody @Valid CategoryIngredient categoryIngredient,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CategoryIngredient categoryIngredientCreate = this.categoryIngredientService.upsert(categoryIngredient);
        return ResponseEntity.status(HttpStatus.OK).body(categoryIngredientCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateCategoryIngredient(@PathVariable("id") Integer id,
            @RequestBody @Valid CategoryIngredientUpdateDTO categoryIngredient,
            BindingResult bindingResult) {
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

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockCategoryIngredient(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (ingredientService.getAllByCategoryIngredientId(id) != null
                && !ingredientService.getAllByCategoryIngredientId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr("Loại nguyên liệu này đang được sử dụng !"));
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
