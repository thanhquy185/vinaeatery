package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;

@Converter(autoApply = true)
public class UserIsUsingConverter implements AttributeConverter<UserIsUsingEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(UserIsUsingEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UserIsUsingEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? UserIsUsingEnum.fromValue(dbValue) : null;
    }
}