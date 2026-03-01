package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryTableSurchargeTypeEnum;

@Converter(autoApply = true)
public class CategoryTableSurchargeTypeConverter implements AttributeConverter<CategoryTableSurchargeTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(CategoryTableSurchargeTypeEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CategoryTableSurchargeTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? CategoryTableSurchargeTypeEnum.fromValue(dbValue) : null;
    }
}