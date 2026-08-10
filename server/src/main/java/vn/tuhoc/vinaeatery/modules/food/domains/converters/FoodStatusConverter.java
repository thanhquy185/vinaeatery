package vn.tuhoc.vinaeatery.modules.food.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;

@Converter(autoApply = true)
public class FoodStatusConverter implements AttributeConverter<FoodStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(FoodStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public FoodStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? FoodStatusEnum.fromValue(dbValue) : null;
    }
}