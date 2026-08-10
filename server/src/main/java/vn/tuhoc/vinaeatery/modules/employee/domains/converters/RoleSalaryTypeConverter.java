package vn.tuhoc.vinaeatery.modules.employee.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;

@Converter(autoApply = true)
public class RoleSalaryTypeConverter implements AttributeConverter<RoleSalaryTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(RoleSalaryTypeEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public RoleSalaryTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? RoleSalaryTypeEnum.fromValue(dbValue) : null;
    }
}