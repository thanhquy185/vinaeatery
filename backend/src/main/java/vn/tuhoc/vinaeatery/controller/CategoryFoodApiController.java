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
import vn.tuhoc.vinaeatery.domain.CategoryFood;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.domain.dto.CategoryFoodUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CategoryFoodService;
import vn.tuhoc.vinaeatery.service.FoodService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UploadService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-foods")
@AllArgsConstructor
public class CategoryFoodApiController {
    // Properties
    private final CategoryFoodService categoryFoodService;
    private final FoodService foodService;
    private final UploadService uploadService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listCategoryFood(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            CategoryFoodCriteria categoryFoodCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<CategoryFood> listCategoryFood = this.categoryFoodService
                .getAll(categoryFoodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCategoryFood);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailCategoryFood(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        CategoryFood categoryFoodSelected = this.categoryFoodService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(categoryFoodSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateCategoryFood(@RequestPart("category-food") @Valid CategoryFood categoryFood,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "category-foods",
                    String.valueOf(this.categoryFoodService.getLastOne().getId() + 1));
        }
        categoryFood.setImage(image);

        CategoryFood categoryFoodCreate = this.categoryFoodService.upsert(categoryFood);
        return ResponseEntity.status(HttpStatus.OK).body(categoryFoodCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateCategoryFood(@PathVariable("id") Integer id,
            @RequestPart("category-food") @Valid CategoryFoodUpdateDTO categoryFood,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "category-foods", String.valueOf(id));
        }
        categoryFood.setImage(image);

        CategoryFood categoryFoodUpdated = this.categoryFoodService.getOneById(id);
        if (categoryFoodUpdated != null) {
            if (categoryFoodUpdated.getImage() == null || categoryFood.getImage() != null) {
                categoryFoodUpdated.setImage(categoryFood.getImage());
            }
            categoryFoodUpdated.setName(categoryFood.getName());
            categoryFoodUpdated.setDescription(categoryFood.getDescription());
            categoryFoodUpdated.setTimeUpdate(this.timeService.getDateTimeVN(categoryFood.getTimeUpdate()));
            this.categoryFoodService.upsert(categoryFoodUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryFoodUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockCategoryFood(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (foodService.getAllByCategoryFoodId(id) != null
                && !foodService.getAllByCategoryFoodId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr("Loại món ăn này đang được ít nhất 1 món ăn sử dụng !"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        CategoryFood categoryFoodLocked = this.categoryFoodService.getOneById(id);
        if (categoryFoodLocked != null) {
            categoryFoodLocked.setStatus(handleStatus);
            categoryFoodLocked.setTimeUpdate(handleTimeUpdate);
            this.categoryFoodService.lock(categoryFoodLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryFoodLocked);
    }
}
