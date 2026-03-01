package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatusEnum {
    // Enums
    PENDING(0, "Đang chờ xác nhận"),
    CANCELLED(1, "Đã huỷ đơn"),
    CONFIRM(2, "Đã xác nhận");

    // Properties
    private final int value;
    private final String description;

    // Constructors
    OrderStatusEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public int getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static OrderStatusEnum fromDescription(String description) {
        for (OrderStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static OrderStatusEnum fromValue(int value) {
        for (OrderStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}