package vn.tuhoc.vinaeatery.modules.auth.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;

@Converter(autoApply = true)
public class UserMethodConverter implements AttributeConverter<UserMethodEnum, String> {
    @Override
    public String convertToDatabaseColumn(UserMethodEnum method) {
        return (method != null) ? method.getValue() : null;
    }

    @Override
    public UserMethodEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UserMethodEnum.fromValue(dbValue) : null;
    }
}