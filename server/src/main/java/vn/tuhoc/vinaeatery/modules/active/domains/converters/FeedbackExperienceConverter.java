package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;

@Converter(autoApply = true)
public class FeedbackExperienceConverter implements AttributeConverter<FeedbackExperienceEnum, String> {
    @Override
    public String convertToDatabaseColumn(FeedbackExperienceEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public FeedbackExperienceEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? FeedbackExperienceEnum.fromValue(dbValue) : null;
    }
}