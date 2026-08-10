package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;

@Converter(autoApply = true)
public class BillStatusConverter implements AttributeConverter<BillStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(BillStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public BillStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? BillStatusEnum.fromValue(dbValue) : null;
    }
}