package vn.tuhoc.vinaeatery.modules.auth.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserMethodEnum {
    HANDMADE("HANDMADE", "Tạo tài khoản thủ công"),
    GOOGLE("GOOGLE", "Tạo tài khoản bằng Google"),
    FACEBOOK("FACEBOOK", "Tạo tài khoản bằng Facebook");

    private final String value;
    private final String description;

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
        for (UserMethodEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
