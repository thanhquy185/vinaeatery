package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MomoRequestDTO {
    private String partnerCode;

    private String requestType;

    private String ipnUrl;

    private String orderId;

    private String description;

    private String orderInfo;

    private String requestId;

    private String redirectUrl;

    private String lang;

    private String extraData;

    private String signature;

    private Long amount;

    private Long orderExpire;
}
