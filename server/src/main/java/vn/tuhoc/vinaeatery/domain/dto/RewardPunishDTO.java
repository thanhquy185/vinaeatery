package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish;
import vn.tuhoc.vinaeatery.domain.enumm.RewardPunishStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.RewardPunishStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RewardPunishDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String createAt;
    private EmployeeDTO employeeHandle;
    private EmployeeDTO employeeMain;
    private CategoryRewardPunish categoryRewardPunish;
    private String date;
    private Long money;
    private String reason;
    @Convert(converter = RewardPunishStatusConverter.class)
    private RewardPunishStatusEnum status;
}
