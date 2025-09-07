package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SurchargeTypeEnum {
    // Enums
    PERCENT("Phần trăm tiền món ăn", "Phần trăm tiền món ăn"),
    FIXED("Tiền cố định", "Tiền cố định");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    SurchargeTypeEnum(String value, String description) {
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

    public static SurchargeTypeEnum fromValue(String value) {
        for (SurchargeTypeEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}