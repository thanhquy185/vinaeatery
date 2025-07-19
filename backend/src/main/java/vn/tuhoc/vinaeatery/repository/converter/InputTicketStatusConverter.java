package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;

@Converter(autoApply = true)
public class InputTicketStatusConverter implements AttributeConverter<InputTicketStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(InputTicketStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public InputTicketStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? InputTicketStatusEnum.fromValue(dbValue) : null;
    }
}