package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;

@Converter(autoApply = true)
public class HandlePaymentStatusConverter implements AttributeConverter<HandlePaymentStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(HandlePaymentStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public HandlePaymentStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? HandlePaymentStatusEnum.fromValue(dbValue) : null;
    }
}