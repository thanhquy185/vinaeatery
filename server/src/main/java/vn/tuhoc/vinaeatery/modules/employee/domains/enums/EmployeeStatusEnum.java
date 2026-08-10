package vn.tuhoc.vinaeatery.modules.employee.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmployeeStatusEnum {
    ACTIVE("ACTIVE", "Đang làm"),
    INACTIVE("INACTIVE", "Nghỉ làm");

    private final String value;
    private final String description;

    EmployeeStatusEnum(String value, String description) {
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

    @JsonCreator
    public static EmployeeStatusEnum fromDescription(String description) {
        for (EmployeeStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static EmployeeStatusEnum fromValue(String value) {
        for (EmployeeStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
