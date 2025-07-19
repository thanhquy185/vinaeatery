package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FoodStatusEnum {
    // Enums
    INACTIVE(false, "Dừng bán"),
    ACTIVE(true, "Đang bán");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    FoodStatusEnum(Boolean value, String description) {
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

    public static FoodStatusEnum fromValue(Boolean value) {
        for (FoodStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}