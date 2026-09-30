package vn.tuhoc.vinaeatery.modules.active.controllers;

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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.OrderSheetService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/order-sheets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderSheetController {
        OrderSheetService orderSheetService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('ORDER_SHEETS__READ')")
        public ResponseEntity<RestResponseDTO<OrderSheetDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                OrderSheetDetailResponseDTO orderSheetDetail = this.orderSheetService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn phiếu gọi món theo mã phiếu gọi món thành công!",
                                orderSheetDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('ORDER_SHEETS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<OrderSheetSummaryResponseDTO>>> handleGetSummary(
                        OrderSheetCriteria orderSheetCriteria) {
                PageResponseDTO<OrderSheetSummaryResponseDTO> orderSheetSummary = this.orderSheetService
                                .handleGetSummary(orderSheetCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách phiếu gọi món thành công!",
                                orderSheetSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<OrderSheetDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid OrderSheetCreateRequestDTO orderSheetCreateRequestDTO) {
                OrderSheetDetailResponseDTO orderSheetCreated = this.orderSheetService
                                .handleCreate(orderSheetCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm phiếu gọi món thành công!",
                                orderSheetCreated);
        }

        @PutMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('ORDER_SHEETS__UPDATE')")
        public ResponseEntity<RestResponseDTO<OrderSheetDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid OrderSheetUpdateStatusRequestDTO OrderSheetUpdateStatusRequestDTO) {
                OrderSheetDetailResponseDTO orderSheetUpdated = this.orderSheetService.handleUpdateStatus(
                                id,
                                OrderSheetUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin phiếu gọi món thành công!",
                                orderSheetUpdated);
        }
}
