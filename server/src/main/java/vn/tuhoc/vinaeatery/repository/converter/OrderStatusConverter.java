package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<OrderStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(OrderStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public OrderStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? OrderStatusEnum.fromValue(dbValue) : null;
    }
}