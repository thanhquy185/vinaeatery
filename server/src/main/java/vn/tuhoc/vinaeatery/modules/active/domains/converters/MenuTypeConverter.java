package vn.tuhoc.vinaeatery.modules.active.domains.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;

@Converter(autoApply = true)
public class MenuTypeConverter implements AttributeConverter<MenuTypeEnum, String> {
    @Override
    public String convertToDatabaseColumn(MenuTypeEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public MenuTypeEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? MenuTypeEnum.fromValue(dbValue) : null;
    }
}