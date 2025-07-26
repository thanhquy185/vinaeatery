package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;

@Converter(autoApply = true)
public class OrderSheetStatusConverter implements AttributeConverter<OrderSheetStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(OrderSheetStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public OrderSheetStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? OrderSheetStatusEnum.fromValue(dbValue) : null;
    }
}