package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceLeaveEnum;

@Converter(autoApply = true)
public class AttendanceLeaveConverter implements AttributeConverter<AttendanceLeaveEnum, String> {
    @Override
    public String convertToDatabaseColumn(AttendanceLeaveEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public AttendanceLeaveEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? AttendanceLeaveEnum.fromValue(dbValue) : null;
    }
}