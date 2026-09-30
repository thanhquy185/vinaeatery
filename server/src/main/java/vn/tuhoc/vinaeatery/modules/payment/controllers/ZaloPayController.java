package vn.tuhoc.vinaeatery.modules.payment.controllers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.services.interfaces.PaymentService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zalopay")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZaloPayController {
    final PaymentService paymentService;

    public ZaloPayController(@Qualifier("zaloPayServiceImplement") PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping(value = "/create/{paymentMachineId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> handleCreateOrder(
            @PathVariable("paymentMachineId") Integer paymentMachineId) throws Exception {
        return RestResponseUtils.created(
                "Tạo hoá đơn thanh toán bằng ví ZaloPay thành công!",
                ((JSONObject) paymentService.handleCreateOrder(paymentMachineId)).toMap());
    }

    @PostMapping("/callback")
    public ResponseEntity<RestResponseDTO<Object>> handleCallbackOrder(@RequestBody Map<String, String> payload) {
        this.paymentService.handleCallbackOrder(payload);

        return RestResponseUtils.ok(
                "Thanh toán bằng ví ZaloPay thành công!",
                null);
    }
}