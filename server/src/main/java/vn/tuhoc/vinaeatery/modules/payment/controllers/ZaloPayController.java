package vn.tuhoc.vinaeatery.modules.payment.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.services.ZaloPayService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/zalopay")
@RequiredArgsConstructor
public class ZaloPayController {
    private final ZaloPayService zaloPayService;

    @PostMapping(value = "/create/{paymentMachineId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> handleCreateOrder(
            @PathVariable("paymentMachineId") Integer paymentMachineId) throws Exception {
        return RestResponseUtils.created(
                "Tạo hoá đơn thanh toán bằng ví ZaloPay thành công!",
                zaloPayService.handleCreateOrder(paymentMachineId).toMap());
    }

    @PostMapping("/callback")
    public ResponseEntity<RestResponseDTO<Object>> handleCallbackOrder(@RequestBody Map<String, String> payload) {
        this.zaloPayService.handleCallbackOrder(payload);

        return RestResponseUtils.ok(
                "Thanh toán bằng ví ZaloPay thành công!",
                null);
    }
}