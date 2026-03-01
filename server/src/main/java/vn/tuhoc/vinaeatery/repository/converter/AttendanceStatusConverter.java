package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;

@Converter(autoApply = true)
public class AttendanceStatusConverter implements AttributeConverter<AttendanceStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(AttendanceStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public AttendanceStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? AttendanceStatusEnum.fromValue(dbValue) : null;
    }
}