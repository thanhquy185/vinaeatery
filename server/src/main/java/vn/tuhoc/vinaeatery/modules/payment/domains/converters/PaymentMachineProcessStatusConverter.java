package vn.tuhoc.vinaeatery.modules.payment.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;

@Converter(autoApply = true)
public class PaymentMachineProcessStatusConverter
        implements AttributeConverter<PaymentMachineProcessStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(PaymentMachineProcessStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public PaymentMachineProcessStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? PaymentMachineProcessStatusEnum.fromValue(dbValue) : null;
    }
}