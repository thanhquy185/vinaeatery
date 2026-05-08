package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryRewardPunishHandleEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CategoryRewardPunishHandleConverter;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "category_reward_punishes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryRewardPunish {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @NotNull(message = "Tên loại thưởng phạt không được để trống!")
    private String name;
    @Column(columnDefinition = "VARCHAR(10)")
    @Convert(converter = CategoryRewardPunishHandleConverter.class)
    @NotNull(message = "Xử lý không được để trống!")
    private CategoryRewardPunishHandleEnum handle;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
}
