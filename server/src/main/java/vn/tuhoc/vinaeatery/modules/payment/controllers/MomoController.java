package vn.tuhoc.vinaeatery.modules.payment.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.MomoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.services.MomoService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/momo")
@RequiredArgsConstructor
public class MomoController {
    private final MomoService momoService;

    @PostMapping(value = "/create/{paymentMachineId}")
    public ResponseEntity<RestResponseDTO<MomoResponseDTO>> handleCreateOrder(
            @PathVariable("paymentMachineId") Integer paymentMachineId) {
        MomoResponseDTO momoResponseDTO = this.momoService.handleCreateOrder(paymentMachineId);

        return RestResponseUtils.created(
                "Tạo hoá đơn thanh toán bằng ví MoMo thành công!",
                momoResponseDTO);
    }

    @PostMapping("/ipn-handler")
    public ResponseEntity<RestResponseDTO<Object>> handleHandleOrder(@RequestBody Map<String, String> params) {
        this.momoService.handleHandleOrder(params);

        return RestResponseUtils.ok(
                "Thanh toán bằng ví MoMo thành công!",
                null);
    }

    @PostMapping(value = "/cancel/{orderId}")
    public ResponseEntity<RestResponseDTO<MomoResponseDTO>> handleCancelOrder(
            @PathVariable("orderId") String orderId,
            @RequestParam(value = "amount", required = false) Long amount) {
        MomoResponseDTO momoResponseDTO = momoService.handleCancelOrder(orderId, amount);

        return RestResponseUtils.ok(
                "Huỷ thanh toán bằng ví MoMo thành công!",
                momoResponseDTO);
    }
}
