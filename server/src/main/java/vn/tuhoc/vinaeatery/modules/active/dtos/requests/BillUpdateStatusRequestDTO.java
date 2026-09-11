package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillUpdateStatusRequestDTO {
    @NotNull(message = "Trạng thái hoá đơn không được để trống!")
    @Convert(converter = BillStatusConverter.class)
    BillStatusEnum status;
}
