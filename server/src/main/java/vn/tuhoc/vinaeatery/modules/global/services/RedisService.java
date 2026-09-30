package vn.tuhoc.vinaeatery.modules.global.services;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RedisService {
    RedisTemplate<String, Object> redisTemplate;
    StringRedisTemplate stringRedisTemplate;

    public void set(String key, Object value) {
        this.redisTemplate.opsForValue().set(key, value);
    }

    public void setWithTTL(String key, Object value, long timeout, TimeUnit timeUnit) {
        this.redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    public Object get(String key) {
        return this.redisTemplate.opsForValue().get(key);
    }

    public Boolean delete(String key) {
        return this.redisTemplate.delete(key);
    }

    public Boolean hasKey(String key) {
        return this.redisTemplate.hasKey(key);
    }

    // === String operations với StringRedisTemplate (chuyên cho String) ===
    public void setString(String key, String value) {
        this.stringRedisTemplate.opsForValue().set(key, value);
    }

    public void setStringWithTTL(String key, String value, long timeout, TimeUnit unit) {
        this.stringRedisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public String getString(String key) {
        return this.stringRedisTemplate.opsForValue().get(key);
    }

    // === Hash operations (lưu object) ===
    public void putHash(String key, String hashKey, Object value) {
        this.redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public Object getHash(String key, String hashKey) {
        return this.redisTemplate.opsForHash().get(key, hashKey);
    }

    // === List operations ===
    public void pushToList(String key, Object value) {
        this.redisTemplate.opsForList().rightPush(key, value);
    }

    public Object popFromList(String key) {
        return this.redisTemplate.opsForList().leftPop(key);
    }

    public Long getListSize(String key) {
        return this.redisTemplate.opsForList().size(key);
    }
}
