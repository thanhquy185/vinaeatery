package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;

@Data
public class InputTicketUpdatePaymentStatusRequestDTO {
    @NotNull(message = "Trạng thái thanh toán không được để trống!")
    @Convert(converter = InputTicketPaymentStatusConverter.class)
    private InputTicketPaymentStatusEnum paymentStatus;
}
