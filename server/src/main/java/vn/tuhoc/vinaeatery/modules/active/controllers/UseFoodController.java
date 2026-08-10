package vn.tuhoc.vinaeatery.modules.active.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.UseFoodService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/use-foods")
@RequiredArgsConstructor
public class UseFoodController {
        private final UseFoodService useFoodService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('USE_FOODS__READ')")
        public ResponseEntity<RestResponseDTO<UseFoodDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                UseFoodDetailResponseDTO useFoodDetail = this.useFoodService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn sử dụng món ăn theo mã sử dụng món ăn thành công!",
                                useFoodDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('USE_FOODS__READ')")
        public ResponseEntity<RestResponseDTO<Page<UseFoodSummaryResponseDTO>>> handleGetSummary(
                        UseFoodCriteria useFoodCriteria) {
                Page<UseFoodSummaryResponseDTO> useFoodSummary = this.useFoodService
                                .handleGetSummary(useFoodCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách sử dụng món ăn thành công!",
                                useFoodSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('USE_FOODS__CREATE')")
        public ResponseEntity<RestResponseDTO<UseFoodDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid UseFoodCreateRequestDTO useFoodCreateRequestDTO) {
                UseFoodDetailResponseDTO useFoodCreated = this.useFoodService.handleCreate(useFoodCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm sử dụng món ăn thành công!",
                                useFoodCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('USE_FOODS__UPDATE')")
        public ResponseEntity<RestResponseDTO<UseFoodDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid UseFoodUpdateStatusRequestDTO useFoodUpdateStatusRequestDTO) {
                UseFoodDetailResponseDTO useFoodUpdated = this.useFoodService.handleUpdateStatus(
                                id,
                                useFoodUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái sử dụng món ăn thành công!",
                                useFoodUpdated);
        }
}