package vn.tuhoc.vinaeatery.modules.active.controllers;

import java.util.List;

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
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.BillCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.BillService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillController {
        final BillService billService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('BILLS__READ')")
        public ResponseEntity<RestResponseDTO<BillDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                BillDetailResponseDTO billDetail = this.billService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn hoá đơn theo mã hoá đơn thành công!",
                                billDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('BILLS__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<BillSummaryResponseDTO>>> handleGetSummary(
                        BillCriteria billCriteria) {
                PageResponseDTO<BillSummaryResponseDTO> billSummary = this.billService.handleGetSummary(billCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách hoá đơn thành công!",
                                billSummary);
        }

        @GetMapping("/customer/{customerId}")
        public ResponseEntity<RestResponseDTO<List<BillCustomerResponseDTO>>> handleGetAllByCustomerId(
                        @PathVariable("customerId") Integer customerId) {
                List<BillCustomerResponseDTO> billCustomer = this.billService
                                .handleGetAllByCustomerId(customerId);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách hoá đơn theo mã khách hàng thành công!",
                                billCustomer);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('BILLS__CREATE')")
        public ResponseEntity<RestResponseDTO<BillDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid BillCreateRequestDTO billCreateRequestDTO) {
                BillDetailResponseDTO billCreated = this.billService.handleCreate(billCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm hoá đơn thành công!",
                                billCreated);
        }

        @PatchMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('BILLS__UPDATE')")
        public ResponseEntity<RestResponseDTO<BillDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid BillUpdateStatusRequestDTO billUpdateStatusRequestDTO) {
                BillDetailResponseDTO billUpdateStatus = this.billService.handleUpdateStatus(
                                id,
                                billUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái hoá đơn thành công!",
                                billUpdateStatus);
        }
}
