package vn.tuhoc.vinaeatery.modules.food.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;

@Converter(autoApply = true)
public class InputTicketPaymentStatusConverter implements AttributeConverter<InputTicketPaymentStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(InputTicketPaymentStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public InputTicketPaymentStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? InputTicketPaymentStatusEnum.fromValue(dbValue) : null;
    }
}