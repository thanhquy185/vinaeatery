package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

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
public class ZaloPayRequestDTO {
    long appId;

    String appTransId;

    long appTime;

    long amount;

    String appUser;

    String item; // JSON array

    String description;

    String bankCode;

    String callbackUrl;

    String mac;
}
