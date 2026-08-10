package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;

@Converter(autoApply = true)
public class BillPaymentStatusConverter implements AttributeConverter<BillPaymentStatusEnum, String> {
    @Override
    public String convertToDatabaseColumn(BillPaymentStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public BillPaymentStatusEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? BillPaymentStatusEnum.fromValue(dbValue) : null;
    }
}