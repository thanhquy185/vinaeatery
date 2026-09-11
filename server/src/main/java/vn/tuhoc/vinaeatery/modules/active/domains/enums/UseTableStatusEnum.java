package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum UseTableStatusEnum {
    REPAIR("REPAIR", "Đang bảo trì"),
    EMPTY("EMPTY", "Đang trống"),
    RESERVED("RESERVED", "Đã đặt bàn"),
    OCCUPIED("OCCUPIED", "Đang có khách");

    final String value;
    final String description;

    UseTableStatusEnum(String value, String description) {
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
    public static UseTableStatusEnum fromDescription(String description) {
        for (UseTableStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static UseTableStatusEnum fromValue(String value) {
        for (UseTableStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}