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
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.modules.active.services.UseTableService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/use-tables")
@RequiredArgsConstructor
public class UseTableController {
        private final UseTableService useTableService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('USE_TABLES__READ')")
        public ResponseEntity<RestResponseDTO<UseTableDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Long id) {
                UseTableDetailResponseDTO useTableDetail = this.useTableService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn sử dụng bàn ăn theo mã sử dụng bàn ăn thành công!",
                                useTableDetail);
        }

        @GetMapping("/restaurant/{restaurantId}/table/{tableId}")
        public ResponseEntity<RestResponseDTO<UseTableCustomerResponseDTO>> handleGetDetailByByRestaurantIdTableIdAndEndAtIsNull(
                        @PathVariable("restaurantId") Integer restaurantId,
                        @PathVariable("tableId") Integer tableId) {
                UseTableCustomerResponseDTO useTableCustomer = this.useTableService
                                .handleGetDetailByByRestaurantIdTableIdAndEndAtIsNull(restaurantId, tableId);

                return RestResponseUtils.ok(
                                "Truy vấn sử dụng bàn ăn mới nhất theo mã nhà hàng và mã bàn ăn thành công!",
                                useTableCustomer);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('USE_TABLES__READ')")
        public ResponseEntity<RestResponseDTO<Page<UseTableSummaryResponseDTO>>> handleGetSummary(
                        UseTableCriteria useTableCriteria) {
                Page<UseTableSummaryResponseDTO> useTableSummary = this.useTableService
                                .handleGetSummary(useTableCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách sử dụng bàn ăn thành công!",
                                useTableSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('USE_TABLES__CREATE')")
        public ResponseEntity<RestResponseDTO<UseTableDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid UseTableCreateRequestDTO useTableCreateRequestDTO) {
                UseTableDetailResponseDTO useTableCreated = this.useTableService.handleCreate(useTableCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm sử dụng bàn ăn thành công!",
                                useTableCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('USE_TABLES__UPDATE')")
        public ResponseEntity<RestResponseDTO<UseTableDetailResponseDTO>> handleUpdateStatus(
                        @PathVariable("id") Long id,
                        @RequestBody @Valid UseTableUpdateStatusRequestDTO useTableUpdateStatusRequestDTO) {
                UseTableDetailResponseDTO useTableUpdated = this.useTableService.handleUpdateStatus(
                                id,
                                useTableUpdateStatusRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái sử dụng bàn ăn thành công!",
                                useTableUpdated);
        }
}