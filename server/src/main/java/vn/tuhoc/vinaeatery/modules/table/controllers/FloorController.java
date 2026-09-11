package vn.tuhoc.vinaeatery.modules.table.controllers;

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
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.modules.table.services.interfaces.FloorService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/floors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FloorController {
        final FloorService floorService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('FLOORS__READ')")
        public ResponseEntity<RestResponseDTO<FloorDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                FloorDetailResponseDTO floorDetail = this.floorService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn tầng theo mã tầng thành công!",
                                floorDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('FLOORS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<FloorSummaryResponseDTO>>> handleGetSummary(
                        FloorCriteria floorCriteria) {
                PageResponseDTO<FloorSummaryResponseDTO> floorSummary = this.floorService
                                .handleGetSummary(floorCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách tầng thành công!",
                                floorSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('FLOORS__READ')")
        public ResponseEntity<RestResponseDTO<List<FloorCrudResponseDTO>>> getCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<FloorCrudResponseDTO> floorCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.floorService.handleGetCrud(restaurantId)
                                : this.floorService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách tầng để xử lý thông tin thành công!",
                                floorCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('FLOORS__CREATE')")
        public ResponseEntity<RestResponseDTO<FloorDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid FloorCreateRequestDTO floorCreateRequestDTO) {
                FloorDetailResponseDTO floorCreated = this.floorService.handleCreate(floorCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm tầng thành công!",
                                floorCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('FLOORS__UPDATE')")
        public ResponseEntity<RestResponseDTO<FloorDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid FloorUpdateRequestDTO floorUpdateRequestDTO) {
                FloorDetailResponseDTO floorUpdated = this.floorService.handleUpdate(id,
                                floorUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin tầng thành công!",
                                floorUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('FLOORS__DELETE')")
        public ResponseEntity<RestResponseDTO<FloorDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid FloorDeleteRequestDTO floorDeleteRequestDTO) {
                FloorDetailResponseDTO floorDeleted = this.floorService.handleDelete(id,
                                floorDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái tầng thành công!",
                                floorDeleted);
        }
}