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
public enum PaymentMachineProcessStatusEnum {
    PENDING("PENDING", "Đang chọn phương thức thanh toán"),
    CANCELLED("CANCELLED", "Huỷ thanh toán hoá đơn"),
    SELECTED("SELECTED", "Đã chọn phương thức thanh toán"),
    FEEDBACK("FEEDBACK", "Đã hoàn tất đánh giá cửa hàng"),
    COMPLETED("COMPLETED", "Đã hoàn tất thanh toán hoá đơn");

    String value;
    String description;

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static PaymentMachineProcessStatusEnum fromDescription(String description) {
        for (PaymentMachineProcessStatusEnum processStatus : values()) {
            if (processStatus.getDescription().equalsIgnoreCase(description)) {
                return processStatus;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static PaymentMachineProcessStatusEnum fromValue(String value) {
        for (PaymentMachineProcessStatusEnum processStatus : values()) {
            if (processStatus.getValue().equals(value)) {
                return processStatus;
            }
        }
        throw new IllegalArgumentException("Invalid process status: " + value);
    }
}