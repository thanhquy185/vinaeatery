package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

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
public class MomoRequestDTO {
    String partnerCode;

    String requestType;

    String ipnUrl;

    String orderId;

    String description;

    String orderInfo;

    String requestId;

    String redirectUrl;

    String lang;

    String extraData;

    String signature;

    Long amount;

    Long orderExpire;
}
