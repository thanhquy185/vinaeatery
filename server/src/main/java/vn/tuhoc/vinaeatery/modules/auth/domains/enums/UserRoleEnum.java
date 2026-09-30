package vn.tuhoc.vinaeatery.modules.auth.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum UserRoleEnum {
    ADMIN("ADMIN", "Quản trị hệ thống"),
    MANAGER("MANAGER", "Chủ nhà hàng"),
    CUSTOMER("CUSTOMER", "Khách hàng"),
    EMPLOYEE("EMPLOYEE", "Nhân viên nhà hàng");

    String value;
    String description;

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
        for (UserRoleEnum role : values()) {
            if (role.getValue().equals(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + value);
    }
}
