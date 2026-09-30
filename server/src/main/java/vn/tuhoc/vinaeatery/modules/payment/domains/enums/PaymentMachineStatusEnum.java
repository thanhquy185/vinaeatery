package vn.tuhoc.vinaeatery.modules.payment.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum PaymentMachineStatusEnum {
    PROCESSING("PROCESSING", "Đang xử lý"),
    CANCELLED("CANCELLED", "Đã huỷ bỏ"),
    COMPLETED("COMPLETED", "Đã hoàn thành");

    String value;
    String description;

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