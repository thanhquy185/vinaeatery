package vn.tuhoc.vinaeatery.modules.global.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CommonStatusEnum {
    ACTIVE("ACTIVE", "Hoạt động"),
    INACTIVE("INACTIVE", "Tạm dừng");

    private final String value;
    private final String description;

    CommonStatusEnum(String value, String description) {
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
    public static CommonStatusEnum fromDescription(String description) {
        for (CommonStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static CommonStatusEnum fromValue(String value) {
        for (CommonStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
