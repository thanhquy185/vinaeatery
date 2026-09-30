package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum BillPaymentStatusEnum {
    PAID("PAID", "Đã thanh toán"),
    UNPAID("UNPAID", "Chưa thanh toán");

    String value;
    String description;

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static BillPaymentStatusEnum fromDescription(String description) {
        for (BillPaymentStatusEnum paymentStatus : values()) {
            if (paymentStatus.getDescription().equalsIgnoreCase(description)) {
                return paymentStatus;
            }
        }

        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static BillPaymentStatusEnum fromValue(String value) {
        for (BillPaymentStatusEnum paymentStatus : values()) {
            if (paymentStatus.getValue().equals(value)) {
                return paymentStatus;
            }
        }

        throw new IllegalArgumentException("Invalid payment status: " + value);
    }
}