package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Floor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FloorCreateRequest {
    private FormSecurityDTO formSecurity;
    private Floor floor;
}
