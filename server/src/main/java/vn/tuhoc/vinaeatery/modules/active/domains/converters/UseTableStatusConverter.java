package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;

@Converter(autoApply = true)
public class UseTableStatusConverter implements AttributeConverter<UseTableStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(UseTableStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UseTableStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? UseTableStatusEnum.fromValue(dbValue) : null;
    }
}