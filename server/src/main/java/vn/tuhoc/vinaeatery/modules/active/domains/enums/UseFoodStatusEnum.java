package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UseFoodStatusEnum {
    CAN_ORDER("CAN_ORDER", "Còn phục vụ"),
    CAN_NOT_ORDER("CAN_NOT_ORDER", "Hết phục vụ");

    private final String value;
    private final String description;

    UseFoodStatusEnum(String value, String description) {
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
    public static UseFoodStatusEnum fromDescription(String description) {
        for (UseFoodStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static UseFoodStatusEnum fromValue(String value) {
        for (UseFoodStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}