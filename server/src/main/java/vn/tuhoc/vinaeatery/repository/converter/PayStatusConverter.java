package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;

@Converter(autoApply = true)
public class PayStatusConverter implements AttributeConverter<PayStatusEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(PayStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public PayStatusEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? PayStatusEnum.fromValue(dbValue) : null;
    }
}