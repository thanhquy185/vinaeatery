package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;

@Data
public class InputTicketUpdateStatusRequestDTO {
    @NotNull(message = "Trạng thái phiếu nhập không được để trống!")
    @Convert(converter = InputTicketStatusConverter.class)
    private InputTicketStatusEnum status;
}
