package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@Data
public class OrderSheetUpdateStatusRequestDTO {
    private Integer employeeId;

    private String serviceAt;

    private String cancelAt;

    private String message;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;
}
