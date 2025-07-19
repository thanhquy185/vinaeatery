package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@Converter(autoApply = true)
public class CommonStatusConverter implements AttributeConverter<CommonStatusEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(CommonStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CommonStatusEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? CommonStatusEnum.fromValue(dbValue) : null;
    }
}