package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ExpenseTypeEnum {
    INPUT_TICKET("INPUT_TICKET", "Phiếu nhập"),
    INGREDIENT("INGREDIENT", "Nguyên liệu"),
    SUPPLIER("SUPPLIER", "Nhà cung cấp");

    String value;
    String description;

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