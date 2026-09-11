package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum MenuTypeEnum {
    ALA_CARTE("ALA_CARTE", "Gọi tự do"),
    BUFFET("BUFFET", "Gọi buffet");

    final String value;
    final String description;

    MenuTypeEnum(String value, String description) {
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
    public static MenuTypeEnum fromDescription(String description) {
        for (MenuTypeEnum type : values()) {
            if (type.getDescription().equalsIgnoreCase(description)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static MenuTypeEnum fromValue(String value) {
        for (MenuTypeEnum type : values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid type: " + value);
    }
}