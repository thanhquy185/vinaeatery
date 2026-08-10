package vn.tuhoc.vinaeatery.modules.payment.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentMachineProcessStatusEnum {
    PENDING("PENDING", "Đang chọn phương thức thanh toán"),
    CANCELLED("CANCELLED", "Huỷ thanh toán hoá đơn"),
    SELECTED("SELECTED", "Đã chọn phương thức thanh toán"),
    FEEDBACK("FEEDBACK", "Đã hoàn tất đánh giá cửa hàng"),
    COMPLETED("COMPLETED", "Đã hoàn tất thanh toán hoá đơn");

    private final String value;
    private final String description;

    PaymentMachineProcessStatusEnum(String value, String description) {
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
    public static PaymentMachineProcessStatusEnum fromDescription(String description) {
        for (PaymentMachineProcessStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static PaymentMachineProcessStatusEnum fromValue(String value) {
        for (PaymentMachineProcessStatusEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}