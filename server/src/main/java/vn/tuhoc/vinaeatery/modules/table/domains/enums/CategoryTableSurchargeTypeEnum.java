package vn.tuhoc.vinaeatery.modules.table.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum CategoryTableSurchargeTypeEnum {
    FIXED("FIXED", "Tiền cố định"),
    PERCENT("PERCENT", "Phần trăm tiền món ăn");

    final String value;
    final String description;

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
        for (CategoryTableSurchargeTypeEnum surchargeType : values()) {
            if (surchargeType.getDescription().equalsIgnoreCase(description)) {
                return surchargeType;
            }
        }

        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static CategoryTableSurchargeTypeEnum fromValue(String value) {
        for (CategoryTableSurchargeTypeEnum surchargeType : values()) {
            if (surchargeType.getValue().equalsIgnoreCase(value)) {
                return surchargeType;
            }
        }

        throw new IllegalArgumentException("Invalid surcharge type: " + value);
    }
}