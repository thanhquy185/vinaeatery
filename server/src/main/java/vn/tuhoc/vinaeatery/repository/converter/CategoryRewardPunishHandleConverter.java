package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryRewardPunishHandleEnum;

@Converter(autoApply = true)
public class CategoryRewardPunishHandleConverter implements AttributeConverter<CategoryRewardPunishHandleEnum, String> {
    @Override
    public String convertToDatabaseColumn(CategoryRewardPunishHandleEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public CategoryRewardPunishHandleEnum convertToEntityAttribute(String dbValue) {
        return (dbValue != null) ? CategoryRewardPunishHandleEnum.fromValue(dbValue) : null;
    }
}