package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UseTableStatusEnum {
    // Enums
    OCCUPIED(3, "Đang có khách"),
    RESERVED(2, "Đã đặt bàn"),
    EMPTY(1, "Đang trống"),
    REPAIR(0, "Đang bảo trì");

    // Properties
    private final Integer value;
    private final String description;

    // Constructors
    UseTableStatusEnum(Integer value, String description) {
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

    public static UseTableStatusEnum fromValue(Integer value) {
        for (UseTableStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}