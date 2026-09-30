package vn.tuhoc.vinaeatery.modules.global.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum CommonGenderEnum {
    MALE("MALE", "Nam"),
    FEMALE("FEMALE", "Nữ");

    String value;
    String description;

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
