package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InputTicketUpdateDTO {
    // Properties
    @Convert(converter = PayStatusConverter.class)
    private PayStatusEnum payStatus;
    @Convert(converter = InputTicketStatusConverter.class)
    private InputTicketStatusEnum status;
}