package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UserIsUsingEnum {
    // Enums
    NOTUSING(false, "Chưa sử dụng"),
    USING(true, "Đang sử dụng");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    UserIsUsingEnum(Boolean value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public Boolean getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static UserIsUsingEnum fromValue(Boolean value) {
        for (UserIsUsingEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
