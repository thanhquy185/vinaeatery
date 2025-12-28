package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRoleEnum {
    // Enums
    ADMIN("ADMIN", "Quản trị hệ thống"),
    MANAGER("MANAGER", "Chủ nhà hàng"),
    EMPLOYEE("EMPLOYEE", "Nhân viên nhà hàng"),
    CUSTOMER("CUSTOMER", "Khách hàng");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    UserRoleEnum(String value, String description) {
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

    public static UserRoleEnum fromValue(String value) {
        for (UserRoleEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}
