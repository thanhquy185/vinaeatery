package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UserMethodEnum {
    // Enums
    FACEBOOK("FACEBOOK", "Tạo tài khoản bằng Facebook"),
    GOOGLE("GOOGLE", "Tạo tài khoản bằng Google"),
    HANDMADE("HANDMADE", "Tạo tài khoản thủ công");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    UserMethodEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public String getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
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
