package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PayStatusEnum {
    // Enums
    PAY(true, "Đã thanh toán"),
    NOTPAY(false, "Chưa thanh toán");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    PayStatusEnum(Boolean value, String description) {
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

    public static PayStatusEnum fromValue(Boolean value) {
        for (PayStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}