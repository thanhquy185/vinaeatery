package vn.tuhoc.vinaeatery.modules.employee.domains.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleSalaryTypeEnum {
    FIXED("FIXED", "Lương cố định"),
    HOUR("HOUR", "Lương theo giờ");

    private final String value;
    private final String description;

    RoleSalaryTypeEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static RoleSalaryTypeEnum fromValue(String value) {
        for (RoleSalaryTypeEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
