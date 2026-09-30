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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.CategoryIngredientService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/category-ingredients")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryIngredientController {
        CategoryIngredientService categoryIngredientService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<CategoryIngredientDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                CategoryIngredientDetailResponseDTO categoryIngredientDetail = this.categoryIngredientService
                                .handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn loại nguyên liệu theo mã loại nguyên liệu thành công!",
                                categoryIngredientDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<CategoryIngredientSummaryResponseDTO>>> handleGetSummary(
                        CategoryIngredientCriteria categoryIngredientCriteria) {
                PageResponseDTO<CategoryIngredientSummaryResponseDTO> categoryIngredientSummary = this.categoryIngredientService
                                .handleGetSummary(categoryIngredientCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại nguyên liệu thành công!",
                                categoryIngredientSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<List<CategoryIngredientCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<CategoryIngredientCrudResponseDTO> categoryIngredientCrud = ValidationUtil
                                .nonNull(restaurantId)
                                                ? this.categoryIngredientService.handleGetCrud(restaurantId)
                                                : this.categoryIngredientService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại nguyên liệu để xử lý thông tin thành công!",
                                categoryIngredientCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__CREATE')")
        public ResponseEntity<RestResponseDTO<CategoryIngredientDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid CategoryIngredientCreateRequestDTO categoryIngredientCreateRequestDTO) {
                CategoryIngredientDetailResponseDTO categoryIngredientCreated = this.categoryIngredientService
                                .handleCreate(categoryIngredientCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm loại nguyên liệu thành công!",
                                categoryIngredientCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__UPDATE')")
        public ResponseEntity<RestResponseDTO<CategoryIngredientDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryIngredientUpdateRequestDTO categoryIngredientUpdateRequestDTO) {
                CategoryIngredientDetailResponseDTO categoryIngredientUpdated = this.categoryIngredientService
                                .handleUpdate(id, categoryIngredientUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin loại nguyên liệu thành công!",
                                categoryIngredientUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_INGREDIENTS__DELETE')")
        public ResponseEntity<RestResponseDTO<CategoryIngredientDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryIngredientDeleteRequestDTO categoryIngredientDeleteRequestDTO) {
                CategoryIngredientDetailResponseDTO categoryIngredientDeleted = this.categoryIngredientService
                                .handleDelete(id, categoryIngredientDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái loại nguyên liệu thành công!",
                                categoryIngredientDeleted);
        }
}
