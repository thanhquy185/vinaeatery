package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;

@Data
@Builder
public class UseFoodCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Mã món ăn không được để trống!")
    private Integer foodId;

    private Integer employeeId;

    @NotNull(message = "Thời gian bắt đầu không được để trống!")
    private String startAt;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseFoodStatusConverter.class)
    private UseFoodStatusEnum status;
}
