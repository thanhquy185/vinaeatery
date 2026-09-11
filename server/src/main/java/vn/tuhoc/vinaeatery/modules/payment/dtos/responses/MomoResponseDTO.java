package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MomoResponseDTO {
    int resultCode;

    String partnerCode;

    String requestId;

    String orderId;

    String message;

    String payUrl;

    String deeplink;

    String qrCodeUrl;

    String deeplinkMiniApp;

    String signature;

    Long responseTime;

    Long amount;

    Long useFee;

    Long orderExpire;
}
