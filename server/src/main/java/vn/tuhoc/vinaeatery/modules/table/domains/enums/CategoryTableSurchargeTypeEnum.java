package vn.tuhoc.vinaeatery.modules.table.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum CategoryTableSurchargeTypeEnum {
    FIXED("FIXED", "Tiền cố định"),
    PERCENT("PERCENT", "Phần trăm tiền món ăn");

    String value;
    String description;

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