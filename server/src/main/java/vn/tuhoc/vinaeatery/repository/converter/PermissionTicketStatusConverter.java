package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.PermissionTicketStatusEnum;

@Converter(autoApply = true)
public class PermissionTicketStatusConverter implements AttributeConverter<PermissionTicketStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(PermissionTicketStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public PermissionTicketStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? PermissionTicketStatusEnum.fromValue(dbValue) : null;
    }
}