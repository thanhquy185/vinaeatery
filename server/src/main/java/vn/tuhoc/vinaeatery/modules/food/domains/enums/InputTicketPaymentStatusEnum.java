package vn.tuhoc.vinaeatery.modules.food.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InputTicketPaymentStatusEnum {
    PAID("PAID", "Đã thanh toán"),
    UNPAID("UNPAID", "Chưa thanh toán");

    private final String value;
    private final String description;

    InputTicketPaymentStatusEnum(String value, String description) {
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
    public static InputTicketPaymentStatusEnum fromDescription(String description) {
        for (InputTicketPaymentStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static InputTicketPaymentStatusEnum fromValue(String value) {
        for (InputTicketPaymentStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}