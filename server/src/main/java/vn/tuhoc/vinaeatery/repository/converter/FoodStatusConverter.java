package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;

@Converter(autoApply = true)
public class FoodStatusConverter implements AttributeConverter<FoodStatusEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(FoodStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public FoodStatusEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? FoodStatusEnum.fromValue(dbValue) : null;
    }
}