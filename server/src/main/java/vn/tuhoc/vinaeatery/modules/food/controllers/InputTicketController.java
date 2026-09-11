package vn.tuhoc.vinaeatery.modules.food.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdatePaymentStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.InputTicketService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/input-tickets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketController {
        private final InputTicketService inputTicketService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('INPUT_TICKETS__READ')")
        public ResponseEntity<RestResponseDTO<InputTicketDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                InputTicketDetailResponseDTO inputTicketDetail = this.inputTicketService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn phiếu nhập theo mã phiếu nhập thành công!",
                                inputTicketDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('INPUT_TICKETS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<InputTicketSummaryResponseDTO>>> handleGetSummary(
                        InputTicketCriteria inputTicketCriteria) {
                PageResponseDTO<InputTicketSummaryResponseDTO> inputTicketSummary = this.inputTicketService
                                .handleGetSummary(inputTicketCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách phiếu nhập thành công!",
                                inputTicketSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INPUT_TICKETS__CREATE')")
        public ResponseEntity<RestResponseDTO<InputTicketDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid InputTicketCreateRequestDTO inputTicketCreateRequestDTO) {
                InputTicketDetailResponseDTO inputTicketCreated = this.inputTicketService
                                .handleCreate(inputTicketCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm phiếu nhập thành công!",
                                inputTicketCreated);
        }

        @PatchMapping(value = "/{id}/payment-status", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INPUT_TICKETS__UPDATE')")
        public ResponseEntity<RestResponseDTO<InputTicketDetailResponseDTO>> handleUpdatePaymentStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid InputTicketUpdatePaymentStatusRequestDTO inputTicketUpdatePaymentStatusRequestDTO) {
                InputTicketDetailResponseDTO inputTicketUpdatePaymentStatus = this.inputTicketService
                                .handleUpdatePaymentStatus(
                                                id,
                                                inputTicketUpdatePaymentStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái thanh toán phiếu nhập thành công!",
                                inputTicketUpdatePaymentStatus);
        }

        @PatchMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('INPUT_TICKETS__UPDATE')")
        public ResponseEntity<RestResponseDTO<InputTicketDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid InputTicketUpdateStatusRequestDTO inputTicketUpdateStatusRequestDTO) {
                InputTicketDetailResponseDTO inputTicketUpdateStatus = this.inputTicketService.handleUpdateStatus(
                                id,
                                inputTicketUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái phiếu nhập thành công!",
                                inputTicketUpdateStatus);
        }
}
