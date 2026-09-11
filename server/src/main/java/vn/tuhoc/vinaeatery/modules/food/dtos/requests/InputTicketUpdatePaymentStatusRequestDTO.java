package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketUpdatePaymentStatusRequestDTO {
    @NotNull(message = "Trạng thái thanh toán không được để trống!")
    @Convert(converter = InputTicketPaymentStatusConverter.class)
    InputTicketPaymentStatusEnum paymentStatus;
}
