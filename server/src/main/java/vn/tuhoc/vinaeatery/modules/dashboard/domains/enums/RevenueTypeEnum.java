package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RevenueTypeEnum {
    BILL("BILL", "Hoá đơn"),
    FOOD("FOOD", "Món ăn"),
    TABLE("TABLE", "Bàn ăn");

    private final String value;
    private final String description;

    RevenueTypeEnum(String value, String description) {
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
    public static RevenueTypeEnum fromDescription(String description) {
        for (RevenueTypeEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static RevenueTypeEnum fromValue(String value) {
        for (RevenueTypeEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}