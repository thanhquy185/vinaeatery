package vn.tuhoc.vinaeatery.modules.auth.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum UserMethodEnum {
    HANDMADE("HANDMADE", "Tạo tài khoản thủ công"),
    GOOGLE("GOOGLE", "Tạo tài khoản bằng Google"),
    FACEBOOK("FACEBOOK", "Tạo tài khoản bằng Facebook");

    String value;
    String description;

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
