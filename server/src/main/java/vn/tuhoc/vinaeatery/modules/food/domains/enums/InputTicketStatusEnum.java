package vn.tuhoc.vinaeatery.modules.food.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InputTicketStatusEnum {
    PENDING("PENDING", "Đang chờ xác nhận"),
    CANCELLED("CANCELLED", "Đã huỷ phiếu"),
    CONFIRMED("CONFIRMED", "Đã nhập hàng");

    private final String value;
    private final String description;

    InputTicketStatusEnum(String value, String description) {
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
    public static InputTicketStatusEnum fromDescription(String description) {
        for (InputTicketStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static InputTicketStatusEnum fromValue(String value) {
        for (InputTicketStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}