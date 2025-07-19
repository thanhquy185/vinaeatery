package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InputTicketStatusEnum {
    // Enums
    PENDING(0, "Đang chờ xác nhận"),
    CANCELLED(1, "Đã huỷ phiếu"),
    CONFIRM(2, "Đã nhập hàng"),
    GIVEBACK(3, "Đã trả hàng");

    // Properties
    private final int value;
    private final String description;

    // Constructors
    InputTicketStatusEnum(int value, String description) {
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
    public static InputTicketStatusEnum fromDescription(String description) {
        for (InputTicketStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static InputTicketStatusEnum fromValue(int value) {
        for (InputTicketStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}