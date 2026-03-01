package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.RewardPunishStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.RewardPunishStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RewardPunishUpdateDTO {
    // Properties
    @Convert(converter = RewardPunishStatusConverter.class)
    private RewardPunishStatusEnum status;
}