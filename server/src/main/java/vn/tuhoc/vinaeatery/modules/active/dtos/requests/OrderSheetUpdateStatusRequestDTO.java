package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetUpdateStatusRequestDTO {
    Integer employeeId;

    String serviceAt;

    String cancelAt;

    String message;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = OrderSheetStatusConverter.class)
    OrderSheetStatusEnum status;
}
