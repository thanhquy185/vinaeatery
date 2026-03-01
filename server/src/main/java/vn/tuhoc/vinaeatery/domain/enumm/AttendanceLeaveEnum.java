package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AttendanceLeaveEnum {
    // Enums
    PAID("PAID", "Nghỉ phép (hưởng lương)"),
    UNPAID("UNPAID", "Nghỉ phép (không lương)"),
    SICK("SICK", "Nghỉ ốm"),
    FAMILY("FAMILY", "Chuyện gia đình"),
    WORK("WORK", "Đi công tác");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    AttendanceLeaveEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public String getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static AttendanceLeaveEnum fromValue(String value) {
        for (AttendanceLeaveEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}