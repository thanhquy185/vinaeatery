package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.SalaryAdvanceStatusEnum;

@Converter(autoApply = true)
public class SalaryAdvanceStatusConverter implements AttributeConverter<SalaryAdvanceStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(SalaryAdvanceStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public SalaryAdvanceStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? SalaryAdvanceStatusEnum.fromValue(dbValue) : null;
    }
}