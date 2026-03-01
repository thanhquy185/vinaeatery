package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EmployeeStatusEnum {
    // Enums
    ACTIVE(true, "Đang làm"),
    INACTIVE(false, "Nghỉ làm");

    // Properties
    private final Boolean value;
    private final String description;

    // Constructors
    EmployeeStatusEnum(Boolean value, String description) {
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

    public static EmployeeStatusEnum fromValue(Boolean value) {
        for (EmployeeStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
