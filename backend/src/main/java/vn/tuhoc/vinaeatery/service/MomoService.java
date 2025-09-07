package vn.tuhoc.vinaeatery.service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.domain.dto.MomoPropertiesDTO;
import vn.tuhoc.vinaeatery.domain.dto.MomoRequestDTO;
import vn.tuhoc.vinaeatery.domain.dto.MomoResponseDTO;
import vn.tuhoc.vinaeatery.util.MomoClientUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {
    // Properties
    private final HandlePaymentService handlePaymentService;
    private final MomoPropertiesDTO momoProperties;
    private final MomoClientUtil momoClientUtil;

    // Methods
    public void test() {
        MomoPropertiesDTO.EnvConfig config = momoProperties.getActiveConfig();
        log.info("PartnerCode: {}", config.getPartnerCode());
        log.info("Endpoint: {}", config.getEndpoint());
    }

    private static String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);
        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public MomoResponseDTO handleCreateMomoQR() {
        MomoPropertiesDTO.EnvConfig config = momoProperties.getActiveConfig();
        // log.info("PartnerCode: {}", config.getPartnerCode());
        // log.info("Endpoint: {}", config.getEndpoint());

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán hoá đơn: " + orderId;
        String extraData = "Không có khuyến mãi gì hết";
        Long amount = handlePaymentService.getOneById(0).getPayTotalPrice();

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                config.getAccessKey(), amount, extraData, config.getIpnUrl(), orderId, orderInfo,
                config.getPartnerCode(),
                config.getRedirectUrl(), requestId,
                config.getRequestType());

        String handleSignature = "";
        try {
            handleSignature = signHmacSHA256(rawSignature, config.getSecretKey());
        } catch (Exception e) {
            log.error("Có lỗi khi xử lý signature: " + e);
            return null;
        }

        if (handleSignature.isBlank()) {
            log.error("Signature is blank !");
            return null;
        }

        MomoRequestDTO momoRequest = MomoRequestDTO.builder()
                .partnerCode(config.getPartnerCode())
                .requestType(config.getRequestType())
                .ipnUrl(config.getIpnUrl())
                .redirectUrl(config.getRedirectUrl())
                .orderId(orderId)
                .orderInfo(orderInfo)
                .requestId(requestId)
                .extraData(extraData)
                .amount(amount)
                .signature(handleSignature)
                .lang("vi")
                .build();

        return this.momoClientUtil.createMomoQR(momoRequest);
    }

    public MomoResponseDTO handleCancelMomoPayment(String orderId, Long amount) {
        MomoPropertiesDTO.EnvConfig config = momoProperties.getActiveConfig();
        String requestId = UUID.randomUUID().toString();
        String description = "Khách hàng hủy giao dịch"; // MoMo dùng description

        // Tạo raw signature chính xác theo MoMo API refund
        String rawSignature = String.format(
                "accessKey=%s&amount=%s&description=%s&orderId=%s&partnerCode=%s&requestId=%s",
                config.getAccessKey(),
                amount,
                description,
                orderId,
                config.getPartnerCode(),
                requestId);

        String signature;
        try {
            signature = signHmacSHA256(rawSignature, config.getSecretKey());
        } catch (Exception e) {
            log.error("Lỗi khi xử lý signature cancel: ", e);
            return null;
        }

        // Tạo request DTO gửi lên MoMo
        MomoRequestDTO cancelRequest = MomoRequestDTO.builder()
                .partnerCode(config.getPartnerCode())
                .orderId(orderId)
                .requestId(requestId)
                .amount(amount)
                .description(description) // phải khớp với rawSignature
                .signature(signature)
                .build();

        return momoClientUtil.cancelMomoPayment(cancelRequest);
    }

}
