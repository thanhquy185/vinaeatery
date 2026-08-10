package vn.tuhoc.vinaeatery.modules.food.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;

@Converter(autoApply = true)
public class InputTicketStatusConverter implements AttributeConverter<InputTicketStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(InputTicketStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public InputTicketStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? InputTicketStatusEnum.fromValue(dbValue) : null;
    }
}