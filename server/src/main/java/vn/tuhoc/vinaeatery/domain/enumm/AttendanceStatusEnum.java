package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AttendanceStatusEnum {
    // Enums
    PENDING(0, "Đang chờ xác nhận"),
    ABSENT(1, "Nghỉ làm"),
    HALF(2, "Nửa công"),
    FULL(3, "Đủ công");

    // Properties
    private final int value;
    private final String description;

    // Constructors
    AttendanceStatusEnum(int value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public int getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static AttendanceStatusEnum fromDescription(String description) {
        for (AttendanceStatusEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static AttendanceStatusEnum fromValue(int value) {
        for (AttendanceStatusEnum status : values()) {
            if (status.getValue() == value) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}