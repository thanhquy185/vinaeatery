package vn.tuhoc.vinaeatery.modules.food.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.CategoryFoodService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/category-foods")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryFoodController {
        CategoryFoodService categoryFoodService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__READ')")
        public ResponseEntity<RestResponseDTO<CategoryFoodDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                CategoryFoodDetailResponseDTO categoryFoodDetail = this.categoryFoodService
                                .handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn loại món ăn theo mã loại món ăn thành công!",
                                categoryFoodDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<CategoryFoodSummaryResponseDTO>>> handleGetSummary(
                        CategoryFoodCriteria categoryFoodCriteria) {
                PageResponseDTO<CategoryFoodSummaryResponseDTO> categoryFoodSummary = this.categoryFoodService
                                .handleGetSummary(categoryFoodCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại món ăn thành công!",
                                categoryFoodSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__READ')")
        public ResponseEntity<RestResponseDTO<List<CategoryFoodCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<CategoryFoodCrudResponseDTO> categoryFoodCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.categoryFoodService.handleGetCrud(restaurantId)
                                : this.categoryFoodService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại món ăn để xử lý thông tin thành công!",
                                categoryFoodCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__CREATE')")
        public ResponseEntity<RestResponseDTO<CategoryFoodDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("category-food") @Valid CategoryFoodCreateRequestDTO categoryFoodCreateRequestDTO) {
                CategoryFoodDetailResponseDTO categoryFoodCreated = this.categoryFoodService
                                .handleCreate(imageFile, categoryFoodCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm loại món ăn thành công!",
                                categoryFoodCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__UPDATE')")
        public ResponseEntity<RestResponseDTO<CategoryFoodDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("category-food") @Valid CategoryFoodUpdateRequestDTO categoryFoodUpdateRequestDTO) {
                CategoryFoodDetailResponseDTO categoryFoodUpdated = this.categoryFoodService.handleUpdate(
                                id,
                                imageFile,
                                categoryFoodUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin loại món ăn thành công!",
                                categoryFoodUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_FOODS__DELETE')")
        public ResponseEntity<RestResponseDTO<CategoryFoodDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryFoodDeleteRequestDTO categoryFoodDeleteRequestDTO) {
                CategoryFoodDetailResponseDTO categoryFoodDeleted = this.categoryFoodService.handleDelete(
                                id,
                                categoryFoodDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái loại món ăn thành công!",
                                categoryFoodDeleted);
        }
}
