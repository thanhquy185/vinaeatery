package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseFoodUpdateStatusRequestDTO {
    @NotNull(message = "Mã nhân viên không được để trống!")
    Integer employeeId;

    @NotNull(message = "Thời gian kết thúc không được để trống!")
    String endAt;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseFoodStatusConverter.class)
    UseFoodStatusEnum status;
}
