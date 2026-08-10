package vn.tuhoc.vinaeatery.modules.table.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoryTableSurchargeTypeEnum {
    FIXED("FIXED", "Tiền cố định"),
    PERCENT("PERCENT", "Phần trăm tiền món ăn");

    private final String value;
    private final String description;

    CategoryTableSurchargeTypeEnum(String value, String description) {
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
    public static CategoryTableSurchargeTypeEnum fromDescription(String description) {
        for (CategoryTableSurchargeTypeEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static CategoryTableSurchargeTypeEnum fromValue(String value) {
        for (CategoryTableSurchargeTypeEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Invalid status: " + value);
    }
}