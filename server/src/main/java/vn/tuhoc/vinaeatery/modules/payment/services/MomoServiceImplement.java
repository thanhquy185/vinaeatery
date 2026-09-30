package vn.tuhoc.vinaeatery.modules.payment.services;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.others.MomoPropertiesDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.MomoRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.MomoResponseDTO;
// import vn.tuhoc.vinaeatery.modules.payment.exceptions.MomoAmountInavailableException;
// import vn.tuhoc.vinaeatery.modules.payment.exceptions.MomoOrderIdInavailableException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.MomoPaymentFailureException;
import vn.tuhoc.vinaeatery.modules.payment.services.interfaces.PaymentService;
import vn.tuhoc.vinaeatery.utils.MomoClientUtil;
// import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MomoServiceImplement implements PaymentService {
    MomoPropertiesDTO momoPropertiesDTO;
    MomoClientUtil momoClientUtil;
    PaymentMachineServiceImplement paymentMachineService;

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

    public MomoResponseDTO handleCreateOrder(Integer paymentMachineId) {
        PaymentMachineEntity paymentMachineEntity = this.paymentMachineService.handleGetOneById(paymentMachineId);

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán hoá đơn: " + orderId;
        String extraData = Base64.getEncoder()
                .encodeToString("Không có khuyến mãi gì hết".getBytes(StandardCharsets.UTF_8));
        Long amount = paymentMachineEntity.getTotalPrice();
        Long orderExpire = System.currentTimeMillis() + 15 * 60 * 1000; // 15 phút

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                this.momoPropertiesDTO.getAccessKey(), amount, extraData, this.momoPropertiesDTO.getIpnUrl(),
                orderId, orderInfo, this.momoPropertiesDTO.getPartnerCode(), this.momoPropertiesDTO.getRedirectUrl(),
                requestId, this.momoPropertiesDTO.getRequestType(), orderExpire);

        String handleSignature = "";
        try {
            handleSignature = signHmacSHA256(rawSignature, this.momoPropertiesDTO.getSecretKey());
        } catch (Exception e) {
            log.error("Có lỗi khi xử lý signature: " + e);
            return null;
        }

        if (handleSignature.isBlank()) {
            log.error("Signature is blank!");
            return null;
        }

        paymentMachineEntity.setPaymentId(orderId);

        MomoRequestDTO momoRequest = MomoRequestDTO.builder()
                .partnerCode(this.momoPropertiesDTO.getPartnerCode())
                .requestType(this.momoPropertiesDTO.getRequestType())
                .ipnUrl(this.momoPropertiesDTO.getIpnUrl())
                .redirectUrl(this.momoPropertiesDTO.getRedirectUrl())
                .orderId(orderId)
                .orderInfo(orderInfo)
                .requestId(requestId)
                .extraData(extraData)
                .signature(handleSignature)
                .amount(amount)
                .orderExpire(orderExpire)
                .lang("vi")
                .build();

        return this.momoClientUtil.createMomoOrder(momoRequest);
    }

    public void handleCallbackOrder(Map<String, String> payload) {
        String resultCode = payload.get("resultCode");
        String orderId = payload.get("orderId");
        Long amount = Long.parseLong(payload.get("amount"));

        if (!resultCode.equals("0")) {
            throw new MomoPaymentFailureException();
        }

        this.paymentMachineService.handleUpdateByWallet(orderId, amount, 4);
    }

    // public MomoResponseDTO handleCancelOrder(String orderId, Long amount) {
    // if (ValidationUtil.isNull(orderId) || !ValidationUtil.hasText(orderId)) {
    // throw new MomoOrderIdInavailableException();
    // }
    // if (ValidationUtil.isNull(amount)) {
    // throw new MomoAmountInavailableException();
    // }

    // String requestId = UUID.randomUUID().toString();
    // String description = "Khách hàng hủy giao dịch"; // MoMo dùng description

    // // Tạo raw signature chính xác theo MoMo API refund
    // String rawSignature = String.format(
    // "accessKey=%s&amount=%s&description=%s&orderId=%s&partnerCode=%s&requestId=%s",
    // this.momoPropertiesDTO.getAccessKey(),
    // amount,
    // description,
    // orderId,
    // this.momoPropertiesDTO.getPartnerCode(),
    // requestId);

    // String signature;
    // try {
    // signature = signHmacSHA256(rawSignature,
    // this.momoPropertiesDTO.getSecretKey());
    // } catch (Exception e) {
    // log.error("Lỗi khi xử lý signature cancel: ", e);
    // return null;
    // }

    // // Tạo request DTO gửi lên MoMo
    // MomoRequestDTO cancelRequest = MomoRequestDTO.builder()
    // .partnerCode(this.momoPropertiesDTO.getPartnerCode())
    // .orderId(orderId)
    // .requestId(requestId)
    // .amount(amount)
    // .description(description)
    // .signature(signature)
    // .build();

    // return this.momoClientUtil.cancelMomoOrder(cancelRequest);
    // }
}
