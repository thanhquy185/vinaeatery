package vn.tuhoc.vinaeatery.modules.payment.dtos.others;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Component
@ConfigurationProperties(prefix = "momo")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoPropertiesDTO {
    String endpoint;

    String accessKey;

    String partnerCode;

    String secretKey;

    String redirectUrl;

    String ipnUrl;

    String requestType;
}
