package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InputTicketSummaryResponseDTO {
    private Integer id;

    private EmployeeSubInfoResponseDTO employee;

    private SupplierInfoResponseDTO supplier;

    private String createAt;

    private Long totalInputPrice;

    @Convert(converter = InputTicketPaymentStatusConverter.class)
    private InputTicketPaymentStatusEnum paymentStatus;

    @Convert(converter = InputTicketStatusConverter.class)
    private InputTicketStatusEnum status;
}
