package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum BillPaymentStatusEnum {
    PAID("PAID", "Đã thanh toán"),
    UNPAID("UNPAID", "Chưa thanh toán");

    final String value;
    final String description;

    BillPaymentStatusEnum(String value, String description) {
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