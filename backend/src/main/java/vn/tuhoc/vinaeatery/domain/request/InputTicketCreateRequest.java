package vn.tuhoc.vinaeatery.domain.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.InputTicket;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailForCrud;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class InputTicketCreateRequest {
    private FormSecurityDTO formSecurity;
    private InputTicket inputTicket;
    private List<InputTicketDetailForCrud> inputTicketDetails;
}
