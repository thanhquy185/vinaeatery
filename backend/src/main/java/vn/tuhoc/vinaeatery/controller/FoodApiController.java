package vn.tuhoc.vinaeatery.controller;

import java.io.IOException;
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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FoodDTO;
import vn.tuhoc.vinaeatery.domain.dto.FoodStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FoodUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.RecipeDTO;
import vn.tuhoc.vinaeatery.domain.entity.Food;
import vn.tuhoc.vinaeatery.domain.entity.Recipe;
import vn.tuhoc.vinaeatery.domain.entity.RecipeId;
import vn.tuhoc.vinaeatery.domain.entity.UseFood;
import vn.tuhoc.vinaeatery.domain.entity.UseTable;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.CloudinaryService;
import vn.tuhoc.vinaeatery.service.FoodService;
import vn.tuhoc.vinaeatery.service.RecipeService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseFoodService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodApiController {
    // Properties
    private final UseFoodService useFoodService;
    private final FoodService foodService;
    private final RecipeService recipeService;
    private final CloudinaryService cloudinaryService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listFood(@RequestBody FormSecurityDTO formSecurityDTO, FoodCriteria foodCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Food> listFood = this.foodService
                .getAll(foodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listFood);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listFoodFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            FoodCriteria foodCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<FoodDTO> listFood = this.foodService
                .getAllFormat(foodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listFood);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailFood(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Food foodSelected = this.foodService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(foodSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateFood(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("food") @Valid Food food,
            @RequestPart("recipe") List<RecipeDTO> recipe,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
            BindingResult bindingResult) throws IOException {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.cloudinaryService.uploadImage(imageFile);
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

            UseFood newUseFood = new UseFood();
            newUseFood.setRestaurantId(foodCreate.getRestaurantId());
            newUseFood.setTimeStart(LocalDateTime.now());
            newUseFood.setFoodId(foodCreate.getId());
            newUseFood.setStatus(UseFoodStatusEnum.CANORDER);
            this.useFoodService.upsert(newUseFood);
        }

        return ResponseEntity.status(HttpStatus.OK).body(foodCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateFood(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("food") @Valid FoodUpdateDTO food,
            @RequestPart("recipe") List<RecipeDTO> recipe,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
            BindingResult bindingResult) throws IOException {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.cloudinaryService.uploadImage(imageFile);
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
            foodUpdated.setUpdateAt(this.timeService.getDateTimeVN(food.getUpdateAt()));
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

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockFood(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("food") @Valid FoodStatusUpdateDTO foodStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "foods", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        FoodStatusEnum handleStatus = foodStatusUpdate.getStatus() == FoodStatusEnum.ACTIVE
                ? FoodStatusEnum.INACTIVE
                : FoodStatusEnum.ACTIVE;
        LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(foodStatusUpdate.getUpdateAt());

        Food foodLocked = this.foodService.getOneById(id);
        if (foodLocked != null) {
            foodLocked.setStatus(handleStatus);
            foodLocked.setUpdateAt(handleUpdateAt);
            this.foodService.lock(foodLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(foodLocked);
    }
}
