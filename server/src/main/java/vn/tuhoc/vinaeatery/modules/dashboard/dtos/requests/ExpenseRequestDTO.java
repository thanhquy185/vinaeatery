package vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.converters.ExpenseTypeConverter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.converters.TimelineConverter;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.ExpenseTypeEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.TimelineEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExpenseRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Loại thống kê không được để trống!")
    @Convert(converter = ExpenseTypeConverter.class)
    private ExpenseTypeEnum type;

    @NotNull(message = "Mốc thời gian không được để trống!")
    @Convert(converter = TimelineConverter.class)
    private TimelineEnum timeline;

    @NotNull(message = "Thời gian cụ thể không được để trống!")
    private String timeDetail;
}
