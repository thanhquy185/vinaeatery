package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;

@Converter(autoApply = true)
public class EmployeeStatusConverter implements AttributeConverter<EmployeeStatusEnum, Boolean> {
    @Override
    public Boolean convertToDatabaseColumn(EmployeeStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public EmployeeStatusEnum convertToEntityAttribute(Boolean dbValue) {
        return (dbValue != null) ? EmployeeStatusEnum.fromValue(dbValue) : null;
    }
}