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
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.UseFoodService;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.FoodService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FoodController {
        UseFoodService useFoodService;
        FoodService foodService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('FOODS__READ')")
        public ResponseEntity<RestResponseDTO<FoodDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                FoodDetailResponseDTO foodDetail = this.foodService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn món ăn theo mã món ăn thành công!",
                                foodDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('FOODS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<FoodSummaryResponseDTO>>> handleGetSummary(
                        FoodCriteria foodCriteria) {
                PageResponseDTO<FoodSummaryResponseDTO> foodSummary = this.foodService.handleGetSummary(foodCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách món ăn thành công!",
                                foodSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('FOODS__READ')")
        public ResponseEntity<RestResponseDTO<List<FoodCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<FoodCrudResponseDTO> foodCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.foodService.handleGetCrud(restaurantId)
                                : this.foodService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách món ăn để xử lý thông tin thành công!",
                                foodCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('FOODS__CREATE')")
        public ResponseEntity<RestResponseDTO<FoodDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("food") @Valid FoodCreateRequestDTO foodCreateRequestDTO) {
                FoodDetailResponseDTO foodCreated = this.foodService.handleCreate(imageFile, foodCreateRequestDTO);

                this.useFoodService.handleCreateByFoodCreated(
                                foodCreated.getRestaurant().getId(),
                                foodCreated.getId(),
                                foodCreateRequestDTO.getEmployeeId());

                return RestResponseUtils.created(
                                "Thêm món ăn thành công!",
                                foodCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAuthority('FOODS__UPDATE')")
        public ResponseEntity<RestResponseDTO<FoodDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("food") @Valid FoodUpdateRequestDTO foodUpdateRequestDTO) {
                FoodDetailResponseDTO foodUpdated = this.foodService.handleUpdate(
                                id,
                                imageFile,
                                foodUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin món ăn thành công!",
                                foodUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('FOODS__DELETE')")
        public ResponseEntity<RestResponseDTO<FoodDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid FoodDeleteRequestDTO foodDeleteRequestDTO) {
                FoodDetailResponseDTO foodDeleted = this.foodService.handleDelete(
                                id,
                                foodDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái món ăn thành công!",
                                foodDeleted);
        }
}
