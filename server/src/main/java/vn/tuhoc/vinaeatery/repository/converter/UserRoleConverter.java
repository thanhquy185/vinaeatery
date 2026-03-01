package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<UserRoleEnum, String> {
    @Override
    public String convertToDatabaseColumn(UserRoleEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UserRoleEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UserRoleEnum.fromValue(dbValue) : null;
    }
}