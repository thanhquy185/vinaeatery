package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseFoodCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã món ăn không được để trống!")
    Integer foodId;

    Integer employeeId;

    @NotNull(message = "Thời gian bắt đầu không được để trống!")
    String startAt;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseFoodStatusConverter.class)
    UseFoodStatusEnum status;
}
