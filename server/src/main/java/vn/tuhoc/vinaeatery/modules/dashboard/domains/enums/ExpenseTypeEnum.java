package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ExpenseTypeEnum {
    INPUT_TICKET("INPUT_TICKET", "Phiếu nhập"),
    INGREDIENT("INGREDIENT", "Nguyên liệu"),
    SUPPLIER("SUPPLIER", "Nhà cung cấp");

    final String value;
    final String description;

    ExpenseTypeEnum(String value, String description) {
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
    public static ExpenseTypeEnum fromDescription(String description) {
        for (ExpenseTypeEnum type : values()) {
            if (type.getDescription().equalsIgnoreCase(description)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static ExpenseTypeEnum fromValue(String value) {
        for (ExpenseTypeEnum type : values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid type: " + value);
    }
}