package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@Data
public class ReservationUpdateStatusRequestDTO {
    private Integer employeeId;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = ReservationStatusConverter.class)
    private ReservationStatusEnum status;
}
