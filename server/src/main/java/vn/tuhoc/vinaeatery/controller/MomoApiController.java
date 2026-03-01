package vn.tuhoc.vinaeatery.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.service.HandlePaymentService;
import vn.tuhoc.vinaeatery.service.MomoService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/momo")
@RequiredArgsConstructor
@Slf4j
public class MomoApiController {
    // Properties
    private final MomoService momoService;
    private final HandlePaymentService handlePaymentService;

    // Methods
    @PostMapping(value = "/create/{handle-payment-id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createQR(@PathVariable("handle-payment-id") Integer handlePaymentId,
            @RequestPart("form-security") FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "momo", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(momoService.handleCreateOrder(handlePaymentId));
    }

    // IPN handler - MoMo gọi khi thanh toán xong
    @PostMapping("/ipn-handler")
    public ResponseEntity<?> ipnHandler(@RequestBody Map<String, String> params) {
        log.info("Received IPN: {}", params);

        String resultCode = params.get("resultCode");
        String orderId = params.get("orderId");
        Long amount = Long.parseLong(params.get("amount"));

        if (!"0".equals(resultCode)) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thanh toán bằng ví MoMo thất bại!");
        }

        this.handlePaymentService.handleByBankWallet(orderId, amount);

        return ResponseEntity.status(HttpStatus.OK).body("Thanh toán bằng ví MoMo thành công!");
    }

    @PostMapping(value = "/cancel/{orderId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cancelPayment(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("orderId") String orderId, @RequestParam("amount") Long amount) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "momo", "cancel")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId bắt buộc để hủy giao dịch");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(momoService.handleCancelOrder(orderId, amount));
    }
}
