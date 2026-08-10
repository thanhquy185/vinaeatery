package vn.tuhoc.vinaeatery.modules.table.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;

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