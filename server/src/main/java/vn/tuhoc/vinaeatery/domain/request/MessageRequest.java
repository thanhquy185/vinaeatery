package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Message;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageRequest {
    //Properties
    private FormSecurityDTO formSecurity;
    private Message message;
}
