package vn.tuhoc.vinaeatery.modules.auth.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum UserMethodEnum {
    HANDMADE("HANDMADE", "Tạo tài khoản thủ công"),
    GOOGLE("GOOGLE", "Tạo tài khoản bằng Google"),
    FACEBOOK("FACEBOOK", "Tạo tài khoản bằng Facebook");

    final String value;
    final String description;

    UserMethodEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static UserMethodEnum fromDescription(String description) {
        for (UserMethodEnum method : values()) {
            if (method.getDescription().equalsIgnoreCase(description)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy phương thức: " + description);
    }

    public static UserMethodEnum fromValue(String value) {
        for (UserMethodEnum method : values()) {
            if (method.getValue().equals(value)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Invalid method: " + value);
    }
}
