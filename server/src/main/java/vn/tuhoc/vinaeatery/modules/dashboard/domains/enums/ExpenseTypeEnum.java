package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ExpenseTypeEnum {
    INPUT_TICKET("INPUT_TICKET", "Phiếu nhập"),
    INGREDIENT("INGREDIENT", "Nguyên liệu"),
    SUPPLIER("SUPPLIER", "Nhà cung cấp");

    private final String value;
    private final String description;

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
        for (ExpenseTypeEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static ExpenseTypeEnum fromValue(String value) {
        for (ExpenseTypeEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}