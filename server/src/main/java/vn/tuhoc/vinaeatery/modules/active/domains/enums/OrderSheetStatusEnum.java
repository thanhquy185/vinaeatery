package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum OrderSheetStatusEnum {
    PENDING("PENDING", "Đang chờ xác nhận"),
    CANCELLED("CANCELLED", "Đã huỷ phiếu"),
    CONFIRMED("CONFIRMED", "Đang làm món"),
    SERVICED("SERVICED", "Đã phục vụ");

    final String value;
    final String description;

    OrderSheetStatusEnum(String value, String description) {
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
    public static OrderSheetStatusEnum fromDescription(String description) {
        for (OrderSheetStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static OrderSheetStatusEnum fromValue(String value) {
        for (OrderSheetStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}