package vn.tuhoc.vinaeatery.modules.global.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Converter(autoApply = true)
public class CommonStatusConverter implements AttributeConverter<CommonStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(CommonStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CommonStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? CommonStatusEnum.fromValue(dbValue) : null;
    }
}