package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineInfoResponseDTO {
    Integer id;

    PaymentMethodInfoResponseDTO paymentMethod;

    EmployeeSubInfoResponseDTO employee;

    String at;

    Long foodPrice;

    Long categoryTableSurcharge;

    Long customerDiscount;

    Long totalPrice;

    String paymentId;

    Long paymentTotalPrice;

    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    PaymentMachineProcessStatusEnum processStatus;

    @Convert(converter = PaymentMachineStatusConverter.class)
    PaymentMachineStatusEnum status;

    List<PaymentMachineFoodDetailResponseDTO> paymentMachineFoods;
}
