package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationUpdateStatusRequestDTO {
    Integer employeeId;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = ReservationStatusConverter.class)
    ReservationStatusEnum status;
}
