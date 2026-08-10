package vn.tuhoc.vinaeatery.modules.global.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CommonGenderEnum {
    MALE("MALE", "Nam"),
    FEMALE("FEMALE", "Nữ");

    private final String value;
    private final String description;

    CommonGenderEnum(String value, String description) {
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
    public static CommonGenderEnum fromDescription(String description) {
        for (CommonGenderEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static CommonGenderEnum fromValue(String value) {
        for (CommonGenderEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
