package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UseFoodStatusEnum {
    // Enums
    CANORDER(1, "Còn phục vụ"),
    CANNOTORDER(0, "Hết phục vụ");

    // Properties
    private final Integer value;
    private final String description;

    // Constructors
    UseFoodStatusEnum(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public Integer getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static UseFoodStatusEnum fromValue(Integer value) {
        for (UseFoodStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}