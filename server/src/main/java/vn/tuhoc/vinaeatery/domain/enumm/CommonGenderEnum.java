package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CommonGenderEnum {
    // Enums
    MALE(true, "Nam"),
    FEMALE(false, "Nữ");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    CommonGenderEnum(Boolean value, String description) {
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

    public static CommonGenderEnum fromValue(Boolean value) {
        for (CommonGenderEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
