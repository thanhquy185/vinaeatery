package vn.tuhoc.vinaeatery.modules.payment.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.services.PaymentMethodServiceImplement;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
        private final PaymentMethodServiceImplement paymentMethodService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<PaymentMethodDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                PaymentMethodDetailResponseDTO paymentMethodDetail = this.paymentMethodService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn phương thức thanh toán theo mã phương thức thanh toán thành công!",
                                paymentMethodDetail);
        }

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<PaymentMethodCrudResponseDTO>>> handleGetCrud() {
                List<PaymentMethodCrudResponseDTO> paymentMethodCrud = this.paymentMethodService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách phương thức thanh toán để xử lý thông tin thành công!",
                                paymentMethodCrud);
        }
}
