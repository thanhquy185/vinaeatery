package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;

@Converter(autoApply = true)
public class UseFoodStatusConverter implements AttributeConverter<UseFoodStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(UseFoodStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UseFoodStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? UseFoodStatusEnum.fromValue(dbValue) : null;
    }
}