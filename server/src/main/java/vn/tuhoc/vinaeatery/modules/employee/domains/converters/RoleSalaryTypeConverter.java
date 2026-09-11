package vn.tuhoc.vinaeatery.modules.employee.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;

@Converter(autoApply = true)
public class RoleSalaryTypeConverter implements AttributeConverter<RoleSalaryTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(RoleSalaryTypeEnum salaryType) {
        return (salaryType != null) ? salaryType.getValue() : null;
    }

    @Override
    public RoleSalaryTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? RoleSalaryTypeEnum.fromValue(dbValue) : null;
    }
}