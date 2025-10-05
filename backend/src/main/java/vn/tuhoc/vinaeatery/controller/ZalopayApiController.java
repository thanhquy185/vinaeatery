package vn.tuhoc.vinaeatery.controller;

import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.service.HandlePaymentService;
import vn.tuhoc.vinaeatery.service.ZalopayService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;
import vn.zalopay.crypto.HMACUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/zalopay")
@RequiredArgsConstructor
public class ZalopayApiController {
    // Values
    @Value("${zalopay.key1}")
    private String key1;
    @Value("${zalopay.key2}")
    private String key2;
    // Properties
    private final ZalopayService zalopayService;
    private final HandlePaymentService handlePaymentService;

    // Methods
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createOrder(@RequestPart("form-security") FormSecurityDTO formSecurityDTO)
            throws Exception {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "zalopay", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(zalopayService.handleCreateOrder().toMap());
    }

    @PostMapping("/callback")
    public ResponseEntity<String> paymentCallback(@RequestBody Map<String, String> payload) {
        String data = payload.get("data");
        String mac = payload.get("mac");

        boolean isValid = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, key2, data).equals(mac);
        if (!isValid)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Giao dịch không hợp lệ !");

        JSONObject dataJson = new JSONObject(data);
        System.out.println(dataJson);
        String appTransId = dataJson.getString("app_trans_id");
        Long amount = dataJson.getLong("amount");

        boolean isSuccess = this.handlePaymentService.handleByBankWallet(appTransId, amount);

        return ResponseEntity.status(HttpStatus.OK).body("Thanh toán bằng ví ZaloPay thành công !");
    }
}