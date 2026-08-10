package vn.tuhoc.vinaeatery.modules.auth.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRoleEnum {
    ADMIN("ADMIN", "Quản trị hệ thống"),
    MANAGER("MANAGER", "Chủ nhà hàng"),
    CUSTOMER("CUSTOMER", "Khách hàng"),
    EMPLOYEE("EMPLOYEE", "Nhân viên nhà hàng");

    private final String value;
    private final String description;

    UserRoleEnum(String value, String description) {
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
    public static UserRoleEnum fromDescription(String description) {
        for (UserRoleEnum role : values()) {
            if (role.getDescription().equalsIgnoreCase(description)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy quyền: " + description);
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
