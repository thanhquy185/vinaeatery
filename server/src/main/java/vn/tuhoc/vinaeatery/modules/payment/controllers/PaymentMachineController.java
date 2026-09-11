package vn.tuhoc.vinaeatery.modules.payment.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.services.PaymentMachineServiceImplement;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/payment-machines")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineController {
        final PaymentMachineServiceImplement paymentMachineService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<PaymentMachineDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                PaymentMachineDetailResponseDTO paymentMachineDetail = this.paymentMachineService
                                .handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn thanh toán POS theo mã thanh toán POS thành công!",
                                paymentMachineDetail);
        }

        @GetMapping("/use-table/{useTableId}")
        public ResponseEntity<RestResponseDTO<PaymentMachineDetailResponseDTO>> handleGetDetailByUseTableId(
                        @PathVariable("useTableId") Integer useTableId) {
                PaymentMachineDetailResponseDTO paymentMachineDetail = this.paymentMachineService
                                .handleGetDetailByUseTableId(useTableId);

                return RestResponseUtils.ok(
                                "Truy vấn thanh toán POS theo mã sử dụng bàn ăn thành công!",
                                paymentMachineDetail);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<PaymentMachineDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid PaymentMachineCreateRequestDTO paymentMachineCreateRequestDTO) {
                PaymentMachineDetailResponseDTO paymentMachineCreated = this.paymentMachineService
                                .handleCreate(paymentMachineCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm thanh toán POS thành công!",
                                paymentMachineCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<PaymentMachineDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid PaymentMachineUpdateRequestDTO paymentMachineUpdateRequestDTO) {
                PaymentMachineDetailResponseDTO paymentMachineUpdated = this.paymentMachineService.handleUpdate(
                                id,
                                paymentMachineUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin thanh toán POS thành công!",
                                paymentMachineUpdated);
        }
}
