package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;

@Converter(autoApply = true)
public class UseTableStatusConverter implements AttributeConverter<UseTableStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(UseTableStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public UseTableStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? UseTableStatusEnum.fromValue(dbValue) : null;
    }
}