package vn.tuhoc.vinaeatery.modules.payment.dtos.others;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Component
@ConfigurationProperties(prefix = "zalopay")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZaloPayPropertiesDTO {
    String appId;

    String key1;

    String key2;

    String endpoint;

    String callbackUrl;
}
