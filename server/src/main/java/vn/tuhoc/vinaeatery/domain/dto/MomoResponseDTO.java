package vn.tuhoc.vinaeatery.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MomoResponseDTO {
    private int resultCode;
    private String partnerCode;
    private String requestId;
    private String orderId;
    private String message;
    private String payUrl;
    private String deeplink;
    private String qrCodeUrl;
    private String deeplinkMiniApp;
    private String signature;
    private Long responseTime;
    private Long amount;
    private Long useFee;
    private Long orderExpire;
}
