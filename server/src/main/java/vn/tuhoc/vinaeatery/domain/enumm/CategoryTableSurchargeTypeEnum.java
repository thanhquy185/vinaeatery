package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoryTableSurchargeTypeEnum {
    // Enums
    FIXED("FIXED", "Tiền cố định"),
    PERCENT("PERCENT", "Phần trăm tiền món ăn");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    CategoryTableSurchargeTypeEnum(String value, String description) {
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

    public static CategoryTableSurchargeTypeEnum fromValue(String value) {
        for (CategoryTableSurchargeTypeEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}