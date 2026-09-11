package vn.tuhoc.vinaeatery.modules.auth.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<UserRoleEnum, String> {
    @Override
    public String convertToDatabaseColumn(UserRoleEnum role) {
        return (role != null) ? role.getValue() : null;
    }

    @Override
    public UserRoleEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UserRoleEnum.fromValue(dbValue) : null;
    }
}