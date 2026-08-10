// ZaloPayRequestDTO.java
package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ZaloPayRequestDTO {
    private long appId;

    private String appTransId;

    private long appTime;

    private long amount;

    private String appUser;

    private String item; // JSON array
    
    private String description;

    private String bankCode;

    private String callbackUrl;

    private String mac;
}
