package vn.tuhoc.vinaeatery.modules.dashboard.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.RevenueTypeEnum;

@Converter(autoApply = true)
public class RevenueTypeConverter implements AttributeConverter<RevenueTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(RevenueTypeEnum type) {
        return (type != null) ? type.getValue() : null;
    }

    @Override
    public RevenueTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? RevenueTypeEnum.fromValue(dbValue) : null;
    }
}