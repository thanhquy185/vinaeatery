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
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.IngredientService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/ingredients")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IngredientController {
        final IngredientService ingredientService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<IngredientDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                IngredientDetailResponseDTO ingredientDetail = this.ingredientService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn nguyên liệu theo mã nguyên liệu thành công!",
                                ingredientDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<IngredientSummaryResponseDTO>>> handleGetSummary(
                        IngredientCriteria ingredientCriteria) {
                PageResponseDTO<IngredientSummaryResponseDTO> ingredientSummary = this.ingredientService
                                .handleGetSummary(ingredientCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nguyên liệu thành công!",
                                ingredientSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('INGREDIENTS__READ')")
        public ResponseEntity<RestResponseDTO<List<IngredientCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<IngredientCrudResponseDTO> ingredientCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.ingredientService.handleGetCrud(restaurantId)
                                : this.ingredientService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nguyên liệu để xử lý thông tin thành công!",
                                ingredientCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INGREDIENTS__CREATE')")
        public ResponseEntity<RestResponseDTO<IngredientDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid IngredientCreateRequestDTO ingredientCreateRequestDTO) {
                IngredientDetailResponseDTO ingredientCreated = this.ingredientService
                                .handleCreate(ingredientCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm nguyên liệu thành công!",
                                ingredientCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INGREDIENTS__UPDATE')")
        public ResponseEntity<RestResponseDTO<IngredientDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid IngredientUpdateRequestDTO ingredientUpdateRequestDTO) {
                IngredientDetailResponseDTO ingredientUpdated = this.ingredientService.handleUpdate(
                                id,
                                ingredientUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin nguyên liệu thành công!",
                                ingredientUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INGREDIENTS__DELETE')")
        public ResponseEntity<RestResponseDTO<IngredientDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid IngredientDeleteRequestDTO ingredientDeleteRequestDTO) {
                IngredientDetailResponseDTO ingredientDeleted = this.ingredientService.handleDelete(
                                id,
                                ingredientDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái nguyên liệu thành công!",
                                ingredientDeleted);
        }
}