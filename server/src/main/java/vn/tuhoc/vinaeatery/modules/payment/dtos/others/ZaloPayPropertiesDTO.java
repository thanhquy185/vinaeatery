package vn.tuhoc.vinaeatery.modules.payment.dtos.others;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "zalopay")
public class ZaloPayPropertiesDTO {
    private String appId;

    private String key1;

    private String key2;

    private String endpoint;

    private String callbackUrl;
}
