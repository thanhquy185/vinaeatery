package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum HandlePaymentStatusEnum {
    // Enums
    NOTHING(0, "Chưa có hoá đơn thanh toán"),
    EXISTS(1, "Đã có hoá đơn thanh toán"),
    PENDING(2, "Đang chọn phương thức thanh toán"),
    SELECTED(3, "Đã chọn phương thức thanh toán"),
    COMPLETED(4, "Đã hoàn tất thanh toán hoá đơn");

    // Properties
    private final Integer value;
    private final String description;

    // Constructors
    HandlePaymentStatusEnum(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public Integer getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static HandlePaymentStatusEnum fromValue(Integer value) {
        for (HandlePaymentStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}