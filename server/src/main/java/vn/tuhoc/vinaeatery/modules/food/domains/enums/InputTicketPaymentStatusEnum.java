package vn.tuhoc.vinaeatery.modules.food.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum InputTicketPaymentStatusEnum {
    PAID("PAID", "Đã thanh toán"),
    UNPAID("UNPAID", "Chưa thanh toán");

    String value;
    String description;

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static InputTicketPaymentStatusEnum fromDescription(String description) {
        for (InputTicketPaymentStatusEnum paymentStatus : values()) {
            if (paymentStatus.getDescription().equalsIgnoreCase(description)) {
                return paymentStatus;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static InputTicketPaymentStatusEnum fromValue(String value) {
        for (InputTicketPaymentStatusEnum paymentStatus : values()) {
            if (paymentStatus.getValue().equalsIgnoreCase(value)) {
                return paymentStatus;
            }
        }
        throw new IllegalArgumentException("Invalid payment status: " + value);
    }
}