package vn.tuhoc.vinaeatery.modules.employee.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum RoleSalaryTypeEnum {
    FIXED("FIXED", "Lương cố định"),
    HOUR("HOUR", "Lương theo giờ");

    String value;
    String description;

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static RoleSalaryTypeEnum fromDescription(String description) {
        for (RoleSalaryTypeEnum salaryType : values()) {
            if (salaryType.getDescription().equalsIgnoreCase(description)) {
                return salaryType;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static RoleSalaryTypeEnum fromValue(String value) {
        for (RoleSalaryTypeEnum salaryType : values()) {
            if (salaryType.getValue().equals(value)) {
                return salaryType;
            }
        }
        throw new IllegalArgumentException("Invalid salary type: " + value);
    }
}
