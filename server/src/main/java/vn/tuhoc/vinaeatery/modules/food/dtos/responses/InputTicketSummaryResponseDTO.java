package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketSummaryResponseDTO {
    Integer id;

    EmployeeSubInfoResponseDTO employee;

    SupplierInfoResponseDTO supplier;

    String createAt;

    Long totalInputPrice;

    @Convert(converter = InputTicketPaymentStatusConverter.class)
    InputTicketPaymentStatusEnum paymentStatus;

    @Convert(converter = InputTicketStatusConverter.class)
    InputTicketStatusEnum status;
}
