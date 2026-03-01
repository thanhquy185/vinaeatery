package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;

@Converter(autoApply = true)
public class UserMethodConverter implements AttributeConverter<UserMethodEnum, String> {
    @Override
    public String convertToDatabaseColumn(UserMethodEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UserMethodEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UserMethodEnum.fromValue(dbValue) : null;
    }
}