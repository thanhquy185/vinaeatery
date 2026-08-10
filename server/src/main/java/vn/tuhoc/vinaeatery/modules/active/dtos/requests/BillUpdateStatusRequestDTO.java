package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;

@Data
public class BillUpdateStatusRequestDTO {
    @NotNull(message = "Trạng thái hoá đơn không được để trống!")
    @Convert(converter = BillStatusConverter.class)
    private BillStatusEnum status;
}
