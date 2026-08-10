package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;

@Data
public class UseFoodUpdateStatusRequestDTO {
    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;

    @NotNull(message = "Thời gian kết thúc không được để trống!")
    private String endAt;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseFoodStatusConverter.class)
    private UseFoodStatusEnum status;
}
