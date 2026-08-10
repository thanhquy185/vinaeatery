package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@Converter(autoApply = true)
public class ReservationStatusConverter implements AttributeConverter<ReservationStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(ReservationStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public ReservationStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? ReservationStatusEnum.fromValue(dbValue) : null;
    }
}