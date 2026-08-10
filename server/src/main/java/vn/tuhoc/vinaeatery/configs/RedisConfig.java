package vn.tuhoc.vinaeatery.configs;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import vn.tuhoc.vinaeatery.utils.RedisTTLUtil;

import java.time.Duration;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {
    private Map<String, RedisCacheConfiguration> generateRedisCacheConfiguration(
            RedisCacheConfiguration defaultConfig) {
        RedisCacheConfiguration cache10Minute = RedisTTLUtil.config10Minute(defaultConfig);
        RedisCacheConfiguration cache30Minute = RedisTTLUtil.config30Minute(defaultConfig);

        Map<String, RedisCacheConfiguration> cacheConfigurations = Map.ofEntries(
                Map.entry("dashboard_profit", cache30Minute),
                Map.entry("dashboard_revenue", cache30Minute),
                Map.entry("dashboard_expense", cache30Minute),
                Map.entry("dashboard_feedback", cache30Minute),

                Map.entry("restaurant__detail", cache10Minute),
                Map.entry("restaurant__summary", cache10Minute),
                Map.entry("restaurant__crud", cache10Minute),
                Map.entry("restaurant__public_detail", cache10Minute),
                Map.entry("restaurant__public_summary", cache10Minute),
                // Map.entry("restaurant__manager", cache10Minute),

                Map.entry("manager__detail", cache10Minute),
                Map.entry("manager__summary", cache10Minute),
                Map.entry("manager__crud", cache10Minute),

                Map.entry("customer__detail", cache10Minute),
                Map.entry("customer__summary", cache10Minute),
                Map.entry("customer__crud", cache10Minute),

                Map.entry("payment_methods__detail", cache30Minute),
                Map.entry("payment_methods__summary", cache30Minute),

                Map.entry("bill__detail", cache10Minute),
                Map.entry("bill__summary", cache10Minute),
                Map.entry("bill__customer", cache10Minute),

                Map.entry("feedback_experience__crud", cache30Minute),
                Map.entry("feedback_score__crud", cache30Minute),

                Map.entry("menu__detail", cache10Minute),
                Map.entry("menu__summary", cache10Minute),

                Map.entry("reservation__detail", cache10Minute),
                Map.entry("reservation__summary", cache10Minute),
                Map.entry("reservation__customer", cache10Minute),
                Map.entry("reservation__crud_all", cache10Minute),
                Map.entry("reservation__crud", cache10Minute),

                Map.entry("floor__detail", cache10Minute),
                Map.entry("floor__summary", cache10Minute),
                Map.entry("floor__crud_all", cache10Minute),
                Map.entry("floor__crud", cache10Minute),

                Map.entry("category_table__detail", cache10Minute),
                Map.entry("category_table__summary", cache10Minute),
                Map.entry("category_table__crud_all", cache10Minute),
                Map.entry("category_table__crud", cache10Minute),

                Map.entry("table__detail", cache10Minute),
                Map.entry("table__summary", cache10Minute),
                Map.entry("table__crud_all", cache10Minute),
                Map.entry("table__crud", cache10Minute),

                Map.entry("input_ticket__detail", cache10Minute),
                Map.entry("input_ticket__summary", cache10Minute),

                Map.entry("supplier__detail", cache10Minute),
                Map.entry("supplier__summary", cache10Minute),
                Map.entry("supplier__crud_all", cache10Minute),
                Map.entry("supplier__crud", cache10Minute),

                Map.entry("category_ingredient__detail", cache10Minute),
                Map.entry("category_ingredient__summary", cache10Minute),
                Map.entry("category_ingredient__crud_all", cache10Minute),
                Map.entry("category_ingredient__crud", cache10Minute),

                Map.entry("ingredient__detail", cache10Minute),
                Map.entry("ingredient__summary", cache10Minute),
                Map.entry("ingredient__crud_all", cache10Minute),
                Map.entry("ingredient__crud", cache10Minute),

                Map.entry("category_food__detail", cache10Minute),
                Map.entry("category_food__summary", cache10Minute),
                Map.entry("category_food__crud_all", cache10Minute),
                Map.entry("category_food__crud", cache10Minute),

                Map.entry("food__detail", cache10Minute),
                Map.entry("food__summary", cache10Minute),
                Map.entry("food__crud_all", cache10Minute),
                Map.entry("food__crud", cache10Minute),

                Map.entry("function__detail", cache30Minute),
                Map.entry("function__summary", cache30Minute),

                Map.entry("role__detail", cache10Minute),
                Map.entry("role__summary", cache10Minute),
                Map.entry("role__crud_all", cache10Minute),
                Map.entry("role__crud", cache10Minute),

                Map.entry("permission__detail", cache10Minute),
                Map.entry("permission__summary", cache10Minute),
                Map.entry("permission__crud_all", cache10Minute),
                Map.entry("permission__crud", cache10Minute),

                Map.entry("employee__detail", cache10Minute),
                Map.entry("employee__summary", cache10Minute),
                Map.entry("employee__crud_all", cache10Minute),
                Map.entry("employee__crud", cache10Minute));

        return cacheConfigurations;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

        return template;
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheWriter cacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(connectionFactory);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        Map<String, RedisCacheConfiguration> cacheConfigurations = this.generateRedisCacheConfiguration(defaultConfig);

        return RedisCacheManager.builder(cacheWriter)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}
