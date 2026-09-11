package vn.tuhoc.vinaeatery.modules.dashboard.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.ExpenseTypeEnum;

@Converter(autoApply = true)
public class ExpenseTypeConverter implements AttributeConverter<ExpenseTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(ExpenseTypeEnum type) {
        return (type != null) ? type.getValue() : null;
    }

    @Override
    public ExpenseTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? ExpenseTypeEnum.fromValue(dbValue) : null;
    }
}