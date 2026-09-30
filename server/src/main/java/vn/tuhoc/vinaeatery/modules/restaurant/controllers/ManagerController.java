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
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.ManagerCriteria;
import vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces.ManagerService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/managers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManagerController {
        final ManagerService managerService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<ManagerDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                ManagerDetailResponseDTO managerDetail = this.managerService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn chủ nhà hàng theo mã chủ nhà hàng thành công!",
                                managerDetail);
        }

        @GetMapping("")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<ManagerSummaryResponseDTO>>> handleGetSummary(
                        ManagerCriteria managerCriteria) {
                PageResponseDTO<ManagerSummaryResponseDTO> managerSummary = this.managerService
                                .handleGetSummary(managerCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách chủ nhà hàng thành công!",
                                managerSummary);
        }

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<ManagerCrudResponseDTO>>> handleGetCrud() {
                List<ManagerCrudResponseDTO> managerCrud = this.managerService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách chủ nhà hàng để xử lý thông tin thành công!",
                                managerCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<ManagerDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("manager") @Valid ManagerCreateRequestDTO managerCreateRequestDTO) {
                ManagerDetailResponseDTO managerCreated = this.managerService
                                .handleCreate(imageFile, managerCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm chủ nhà hàng thành công!",
                                managerCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<ManagerDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("manager") @Valid ManagerUpdateRequestDTO managerUpdateRequestDTO) {
                ManagerDetailResponseDTO managerUpdated = this.managerService.handleUpdate(
                                id,
                                imageFile,
                                managerUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin chủ nhà hàng thành công!",
                                managerUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<ManagerDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid ManagerDeleteRequestDTO managerDeleteRequestDTO) {
                ManagerDetailResponseDTO managerDeleted = this.managerService.handleDelete(
                                id,
                                managerDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái chủ nhà hàng thành công!",
                                managerDeleted);
        }
}