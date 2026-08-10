package vn.tuhoc.vinaeatery.modules.dashboard.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.TimelineEnum;

@Converter(autoApply = true)
public class TimelineConverter implements AttributeConverter<TimelineEnum, String> {
    @Override
    public String convertToDatabaseColumn(TimelineEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public TimelineEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? TimelineEnum.fromValue(dbValue) : null;
    }
}