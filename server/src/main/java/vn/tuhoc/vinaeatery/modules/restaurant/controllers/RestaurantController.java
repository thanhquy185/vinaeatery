package vn.tuhoc.vinaeatery.modules.restaurant.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantManagerResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.RestaurantCriteria;
import vn.tuhoc.vinaeatery.modules.restaurant.services.RestaurantServiceImplement;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantController {
        final RestaurantServiceImplement restaurantService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<RestaurantDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                RestaurantDetailResponseDTO restaurantDetail = this.restaurantService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn nhà hàng theo mã nhà hàng thành công!",
                                restaurantDetail);
        }

        @GetMapping("")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<RestaurantSummaryResponseDTO>>> handleGetSummary(
                        RestaurantCriteria restaurantCriteria) {
                PageResponseDTO<RestaurantSummaryResponseDTO> restaurantSummary = this.restaurantService
                                .handleGetSummary(restaurantCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà hàng thành công!",
                                restaurantSummary);
        }

        @GetMapping("/public/{id}")
        public ResponseEntity<RestResponseDTO<RestaurantPublicDetailResponseDTO>> handleGetPublicDetail(
                        @PathVariable("id") Integer id) {
                RestaurantPublicDetailResponseDTO restaurantPublicDetail = this.restaurantService
                                .handleGetPublicDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn nhà hàng theo mã nhà hàng thành công!",
                                restaurantPublicDetail);
        }

        @GetMapping("/public")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<RestaurantPublicResponseDTO>>> handleGetPublic(
                        RestaurantCriteria restaurantCriteria) {
                PageResponseDTO<RestaurantPublicResponseDTO> restaurantPublic = this.restaurantService
                                .handleGetPublic(restaurantCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà hàng cho khách hàng thành công!",
                                restaurantPublic);
        }

        @GetMapping("/manager/{managerId}")
        public ResponseEntity<RestResponseDTO<List<RestaurantManagerResponseDTO>>> handleGetAllByManagerId(
                        @PathVariable("managerId") Integer managerId) {
                List<RestaurantManagerResponseDTO> restaurantManager = this.restaurantService
                                .handleGetAllByManagerId(managerId);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà hàng cho chủ nhà hàng thành công!",
                                restaurantManager);
        }

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<RestaurantCrudResponseDTO>>> handleGetCrud() {
                List<RestaurantCrudResponseDTO> restaurantCrud = this.restaurantService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách nhà hàng để xử lý thông tin thành công!",
                                restaurantCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<RestaurantDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-files", required = false) MultipartFile[] imageFiles,
                        @RequestPart("restaurant") @Valid RestaurantCreateRequestDTO restaurantCreateRequestDTO) {
                RestaurantDetailResponseDTO restaurantCreated = this.restaurantService
                                .handleCreate(imageFiles, restaurantCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm nhà hàng thành công!",
                                restaurantCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<RestaurantDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-files", required = false) MultipartFile[] imageFiles,
                        @RequestPart("restaurant") @Valid RestaurantUpdateRequestDTO restaurantUpdateRequestDTO) {
                RestaurantDetailResponseDTO restaurantUpdated = this.restaurantService.handleUpdate(
                                id,
                                imageFiles,
                                restaurantUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin nhà hàng thành công!",
                                restaurantUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<RestaurantDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid RestaurantDeleteRequestDTO restaurantDeleteRequestDTO) {
                RestaurantDetailResponseDTO restaurantDeleted = this.restaurantService.handleDelete(
                                id,
                                restaurantDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái nhà hàng thành công!",
                                restaurantDeleted);
        }
}