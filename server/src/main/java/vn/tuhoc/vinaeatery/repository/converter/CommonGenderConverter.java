package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;

@Converter(autoApply = true)
public class CommonGenderConverter implements AttributeConverter<CommonGenderEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(CommonGenderEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CommonGenderEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? CommonGenderEnum.fromValue(dbValue) : null;
    }
}