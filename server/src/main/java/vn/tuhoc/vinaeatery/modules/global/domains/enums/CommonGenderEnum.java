package vn.tuhoc.vinaeatery.modules.global.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum CommonGenderEnum {
    MALE("MALE", "Nam"),
    FEMALE("FEMALE", "Nữ");

    final String value;
    final String description;

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
        for (CommonGenderEnum gender : values()) {
            if (gender.getDescription().equalsIgnoreCase(description)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static CommonGenderEnum fromValue(String value) {
        for (CommonGenderEnum gender : values()) {
            if (gender.getValue().equals(value)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Invalid gender: " + value);
    }
}
