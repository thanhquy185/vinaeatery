package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryRewardPunishHandleEnum;
import vn.tuhoc.vinaeatery.repository.converter.CategoryRewardPunishHandleConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryRewardPunishUpdateDTO {
    @NotNull(message = "Tên loại thưởng phạt không được để trống!")
    private String name;
    @Convert(converter = CategoryRewardPunishHandleConverter.class)
    @NotNull(message = "Xử lý không được để trống!")
    private CategoryRewardPunishHandleEnum handle;
    private String description;
    private String updateAt;
}
