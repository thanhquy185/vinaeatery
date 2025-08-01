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
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Food;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.RecipeId;
import vn.tuhoc.vinaeatery.domain.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FoodDTO;
import vn.tuhoc.vinaeatery.domain.dto.FoodStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FoodUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.domain.dto.RecipeDTO;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.service.FoodService;
import vn.tuhoc.vinaeatery.service.RecipeService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UploadService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
public class FoodApiController {
    // Properties
    private final FoodService foodService;
    private final RecipeService recipeService;
    private final UploadService uploadService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listFood(@RequestBody @Valid FormGetDataDTO formGetDataDTO, FoodCriteria foodCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<Food> listFood = this.foodService
                .getAll(foodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listFood);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listFoodFormat(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            FoodCriteria foodCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<FoodDTO> listFood = this.foodService
                .getAllFormat(foodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listFood);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailFood(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        Food foodSelected = this.foodService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(foodSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateFood(@RequestPart("food") @Valid Food food,
            @RequestPart("recipe") List<RecipeDTO> recipe,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "foods",
                    String.valueOf(this.foodService.getLastOne().getId() + 1));
        }
        food.setImage(image);

        Food foodCreate = this.foodService.upsert(food);
        if (foodCreate != null) {
            if (recipe != null) {
                for (RecipeDTO r : recipe) {
                    this.recipeService.upsert(new Recipe(new RecipeId(foodCreate.getId(), r.getIngredientId()),
                            r.getQuantity(), r.getNote()));
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(foodCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateFood(@PathVariable("id") Integer id,
            @RequestPart("food") @Valid FoodUpdateDTO food, @RequestPart("recipe") List<RecipeDTO> recipe,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "foods",
                    String.valueOf(id));
        }
        food.setImage(image);

        Food foodUpdated = this.foodService.getOneById(id);
        if (foodUpdated != null) {
            if (foodUpdated.getImage() == null || food.getImage() != null) {
                foodUpdated.setImage(food.getImage());
            }
            foodUpdated.setName(food.getName());
            foodUpdated.setCategoryFoodId(food.getCategoryFoodId());
            foodUpdated.setUnit(food.getUnit());
            foodUpdated.setPrice(food.getPrice());
            foodUpdated.setDescription(food.getDescription());
            foodUpdated.setTimeUpdate(this.timeService.getDateTimeVN(food.getTimeUpdate()));
            this.foodService.upsert(foodUpdated);

            if (recipe != null) {
                this.recipeService.deleteAllByFoodId(foodUpdated.getId());
                for (RecipeDTO r : recipe) {
                    this.recipeService.upsert(new Recipe(new RecipeId(foodUpdated.getId(), r.getIngredientId()),
                            r.getQuantity(), r.getNote()));
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(foodUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockFood(@PathVariable("id") Integer id,
            @RequestBody @Valid FoodStatusUpdateDTO foodStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        FoodStatusEnum handleStatus = foodStatusUpdate.getStatus() == FoodStatusEnum.ACTIVE
                ? FoodStatusEnum.INACTIVE
                : FoodStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(foodStatusUpdate.getTimeUpdate());

        Food foodLocked = this.foodService.getOneById(id);
        if (foodLocked != null) {
            foodLocked.setStatus(handleStatus);
            foodLocked.setTimeUpdate(handleTimeUpdate);
            this.foodService.lock(foodLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(foodLocked);
    }
}
