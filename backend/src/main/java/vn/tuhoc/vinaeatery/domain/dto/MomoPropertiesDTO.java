package vn.tuhoc.vinaeatery.domain.dto;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "momo")
public class MomoPropertiesDTO {
    // Properties
    private String env;
    private EnvConfig dev;
    private EnvConfig prod;

    @Data
    public static class EnvConfig {
        private String endpoint;
        private String accessKey;
        private String partnerCode;
        private String secretKey;
        private String redirectUrl;
        private String ipnUrl;
        private String requestType;
    }

    // Methods
    public EnvConfig getActiveConfig() {
        return env.equalsIgnoreCase("prod") ? prod : dev;
    }
}
