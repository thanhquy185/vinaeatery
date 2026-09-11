package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    Long useTableId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    Integer employeeId;

    @NotNull(message = "Thời gian không được để trống!")
    String at;

    @NotNull(message = "Trạng thái xử lý không được để trống!")
    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    PaymentMachineProcessStatusEnum processStatus;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = PaymentMachineStatusConverter.class)
    PaymentMachineStatusEnum status;
}
