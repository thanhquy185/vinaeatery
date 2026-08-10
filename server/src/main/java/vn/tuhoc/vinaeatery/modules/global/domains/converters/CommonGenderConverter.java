package vn.tuhoc.vinaeatery.modules.global.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;

@Converter(autoApply = true)
public class CommonGenderConverter implements AttributeConverter<CommonGenderEnum, String> {
    @Override
    public String convertToDatabaseColumn(CommonGenderEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CommonGenderEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? CommonGenderEnum.fromValue(dbValue) : null;
    }
}