package vn.tuhoc.vinaeatery.utils;

import org.springframework.data.redis.cache.RedisCacheConfiguration;

import java.time.Duration;

public class RedisTTLUtil {
    public static RedisCacheConfiguration config10Second(RedisCacheConfiguration defaultConfig) {
        return defaultConfig.entryTtl(Duration.ofSeconds(10));
    }

    public static RedisCacheConfiguration config30Second(RedisCacheConfiguration defaultConfig) {
        return defaultConfig.entryTtl(Duration.ofSeconds(30));
    }

    public static RedisCacheConfiguration config10Minute(RedisCacheConfiguration defaultConfig) {
        return defaultConfig.entryTtl(Duration.ofMinutes(10));
    }

    public static RedisCacheConfiguration config30Minute(RedisCacheConfiguration defaultConfig) {
        return defaultConfig.entryTtl(Duration.ofMinutes(30));
    }
}
