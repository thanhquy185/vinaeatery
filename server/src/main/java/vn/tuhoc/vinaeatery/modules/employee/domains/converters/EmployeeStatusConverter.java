package vn.tuhoc.vinaeatery.modules.employee.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;

@Converter(autoApply = true)
public class EmployeeStatusConverter implements AttributeConverter<EmployeeStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(EmployeeStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public EmployeeStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? EmployeeStatusEnum.fromValue(dbValue) : null;
    }
}