// ZalopayRequestDTO.java
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
public class ZalopayRequestDTO {
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
