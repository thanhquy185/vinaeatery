package vn.tuhoc.vinaeatery.modules.global.controllers;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.services.RedisService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/redis")
@RequiredArgsConstructor
public class RedisController {
    private final RedisService redisService;

    @PostMapping("/set")
    public String set(@RequestParam String key, @RequestParam String value) {
        redisService.set(key, value);
        return "Set thành công: " + key + " = " + value;
    }

    @PostMapping("/set-ttl")
    public String setWithTTL(
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(defaultValue = "60") long ttl) {
        redisService.setWithTTL(key, value, ttl, TimeUnit.SECONDS);
        return "Set thành công với TTL " + ttl + "s: " + key + " = " + value;
    }

    @GetMapping("/get")
    public Object get(@RequestParam String key) {
        Object value = redisService.get(key);
        if (value == null) {
            return Map.of("message", "Key không tồn tại: " + key);
        }
        return Map.of("key", key, "value", value);
    }

    @DeleteMapping("/delete")
    public String delete(@RequestParam String key) {
        Boolean deleted = redisService.delete(key);
        return deleted ? "Xóa thành công: " + key : "Key không tồn tại: " + key;
    }

    @GetMapping("/exists")
    public Map<String, Object> exists(@RequestParam String key) {
        return Map.of("key", key, "exists", redisService.hasKey(key));
    }

    @PostMapping("/hash")
    public String putHash(
            @RequestParam String key,
            @RequestParam String field,
            @RequestParam String value) {
        redisService.putHash(key, field, value);
        return "Hash set thành công: " + key + "." + field + " = " + value;
    }

    @GetMapping("/hash")
    public Object getHash(@RequestParam String key, @RequestParam String field) {
        Object value = redisService.getHash(key, field);
        if (value == null) {
            return Map.of("message", "Field không tồn tại: " + field);
        }
        return Map.of("key", key, "field", field, "value", value);
    }

    @PostMapping("/list")
    public String pushToList(@RequestParam String key, @RequestParam String value) {
        redisService.pushToList(key, value);
        return "Push thành công vào list " + key + ": " + value;
    }

    @GetMapping("/list")
    public Object popFromList(@RequestParam String key) {
        Object value = redisService.popFromList(key);
        if (value == null) {
            return Map.of("message", "List rỗng hoặc không tồn tại: " + key);
        }
        return Map.of("key", key, "popped", value);
    }
}