package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@Converter(autoApply = true)
public class OrderSheetStatusConverter implements AttributeConverter<OrderSheetStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(OrderSheetStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public OrderSheetStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? OrderSheetStatusEnum.fromValue(dbValue) : null;
    }
}