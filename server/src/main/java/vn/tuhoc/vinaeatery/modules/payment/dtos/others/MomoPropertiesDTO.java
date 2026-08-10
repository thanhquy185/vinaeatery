package vn.tuhoc.vinaeatery.modules.payment.dtos.others;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "momo")
public class MomoPropertiesDTO {
    private String endpoint;

    private String accessKey;

    private String partnerCode;

    private String secretKey;

    private String redirectUrl;

    private String ipnUrl;

    private String requestType;
}
