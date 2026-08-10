package vn.tuhoc.vinaeatery.modules.payment.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMachineDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private UseTableInfoResponseDTO useTable;

    private EmployeeSubInfoResponseDTO employee;

    private PaymentMethodInfoResponseDTO paymentMethod;

    private String at;

    private Long foodPrice;

    private Long categoryTableSurcharge;

    private Long customerDiscount;

    private Long totalPrice;

    private String paymentId;

    private Long paymentTotalPrice;

    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    private PaymentMachineProcessStatusEnum processStatus;

    @Convert(converter = PaymentMachineStatusConverter.class)
    private PaymentMachineStatusEnum status;

    private List<PaymentMachineFoodDetailResponseDTO> paymentMachineFoods;
}
