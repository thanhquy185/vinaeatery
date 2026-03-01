package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CommonStatusEnum {
    // Enums
    ACTIVE(true, "Hoạt động"),
    INACTIVE(false, "Tạm dừng");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    CommonStatusEnum(Boolean value, String description) {
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

    public static CommonStatusEnum fromValue(Boolean value) {
        for (CommonStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
