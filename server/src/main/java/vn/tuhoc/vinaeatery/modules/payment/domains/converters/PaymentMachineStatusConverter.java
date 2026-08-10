package vn.tuhoc.vinaeatery.modules.payment.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;

@Converter(autoApply = true)
public class PaymentMachineStatusConverter implements AttributeConverter<PaymentMachineStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(PaymentMachineStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public PaymentMachineStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? PaymentMachineStatusEnum.fromValue(dbValue) : null;
    }
}