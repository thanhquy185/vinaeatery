package vn.tuhoc.vinaeatery.modules.payment.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMachineCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    private Long useTableId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;

    @NotNull(message = "Thời gian không được để trống!")
    private String at;

    @NotNull(message = "Trạng thái xử lý không được để trống!")
    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    private PaymentMachineProcessStatusEnum processStatus;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = PaymentMachineStatusConverter.class)
    private PaymentMachineStatusEnum status;
}
