package vn.tuhoc.vinaeatery.modules.payment.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum PaymentMachineStatusEnum {
    PROCESSING("PROCESSING", "Đang xử lý"),
    CANCELLED("CANCELLED", "Đã huỷ bỏ"),
    COMPLETED("COMPLETED", "Đã hoàn thành");

    final String value;
    final String description;

    PaymentMachineStatusEnum(String value, String description) {
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
    public static PaymentMachineStatusEnum fromDescription(String description) {
        for (PaymentMachineStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static PaymentMachineStatusEnum fromValue(String value) {
        for (PaymentMachineStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}