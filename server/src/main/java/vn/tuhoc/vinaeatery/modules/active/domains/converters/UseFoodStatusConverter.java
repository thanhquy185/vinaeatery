package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;

@Converter(autoApply = true)
public class UseFoodStatusConverter implements AttributeConverter<UseFoodStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(UseFoodStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UseFoodStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UseFoodStatusEnum.fromValue(dbValue) : null;
    }
}