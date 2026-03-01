package vn.tuhoc.vinaeatery.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.tuhoc.vinaeatery.domain.enumm.RewardPunishStatusEnum;

@Converter(autoApply = true)
public class RewardPunishStatusConverter implements AttributeConverter<RewardPunishStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(RewardPunishStatusEnum status) {
        return (status != null) ? status.getValue() : null;
    }

    @Override
    public RewardPunishStatusEnum convertToEntityAttribute(Integer dbValue) {
        return (dbValue != null) ? RewardPunishStatusEnum.fromValue(dbValue) : null;
    }
}