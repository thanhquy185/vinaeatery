package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderSheetStatusEnum {
    // Enums
    PENDING(0, "Đang chờ xác nhận"),
    CANCELLED(1, "Đã huỷ phiếu"),
    CONFIRM(2, "Đang làm món"),
    SERVICED(3, "Đã phục vụ");

    // Properties
    private final int value;
    private final String description;

    // Constructors
    OrderSheetStatusEnum(int value, String description) {
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
    public static OrderSheetStatusEnum fromDescription(String description) {
        for (OrderSheetStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static OrderSheetStatusEnum fromValue(int value) {
        for (OrderSheetStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}