package vn.tuhoc.vinaeatery.modules.active.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.ReservationCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.ReservationService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {
        private final ReservationService reservationService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('RESERVATIONS__READ')")
        public ResponseEntity<RestResponseDTO<ReservationDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                ReservationDetailResponseDTO reservationDetail = this.reservationService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn đơn đặt bàn theo mã đơn đặt bàn thành công!",
                                reservationDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('RESERVATIONS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<ReservationSummaryResponseDTO>>> handleGetSummary(
                        ReservationCriteria reservationCriteria) {
                PageResponseDTO<ReservationSummaryResponseDTO> reservationSummary = this.reservationService
                                .handleGetSummary(reservationCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách đơn đặt bàn thành công!",
                                reservationSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('RESERVATIONS__READ')")
        public ResponseEntity<RestResponseDTO<List<ReservationCrudResponseDTO>>> handleGetCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<ReservationCrudResponseDTO> reservationCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.reservationService.handleGetCrud(restaurantId)
                                : this.reservationService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách đơn đặt bàn để xử lý thông tin thành công!",
                                reservationCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('RESERVATIONS__CREATE')")
        public ResponseEntity<RestResponseDTO<ReservationDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid ReservationCreateRequestDTO reservationCreateRequestDTO) {
                ReservationDetailResponseDTO reservationCreated = this.reservationService
                                .handleCreate(reservationCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm đơn đặt bàn thành công!",
                                reservationCreated);
        }

        @PatchMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('RESERVATIONS__UPDATE')")
        public ResponseEntity<RestResponseDTO<ReservationDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid ReservationUpdateStatusRequestDTO reservationUpdateStatusRequestDTO) {
                ReservationDetailResponseDTO reservationUpdateStatus = this.reservationService.handleUpdateStatus(
                                id,
                                reservationUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái đơn đặt bàn thành công!",
                                reservationUpdateStatus);
        }

        @GetMapping("/customer")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<ReservationCustomerResponseDTO>>> handleGetAllByCustomerId(
                        ReservationCriteria reservationCriteria) {
                PageResponseDTO<ReservationCustomerResponseDTO> reservationCustomer = this.reservationService
                                .handleGetAllByCustomerId(reservationCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách đơn đặt bàn theo mã khách hàng thành công!",
                                reservationCustomer);
        }

        @PostMapping(value = "/customer", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<ReservationDetailResponseDTO>> handleCustomerCreate(
                        @RequestBody @Valid ReservationCustomerCreateRequestDTO reservationCustomerCreateRequestDTO) {
                ReservationDetailResponseDTO reservationCustomerCreated = this.reservationService
                                .handleCustomerCreate(reservationCustomerCreateRequestDTO);

                return RestResponseUtils.created(
                                "Khách hàng tạo đơn đặt bàn thành công!",
                                reservationCustomerCreated);
        }

        @PatchMapping(value = "/customer/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<ReservationDetailResponseDTO>> handleCustomerUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid ReservationUpdateStatusRequestDTO reservationUpdateStatusRequestDTO) {
                ReservationDetailResponseDTO reservationUpdateStatus = this.reservationService.handleUpdateStatus(
                                id,
                                reservationUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Khách hàng trạng thái đơn đặt bàn thành công!",
                                reservationUpdateStatus);
        }
}