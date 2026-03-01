package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class RestaurantLockRequest {
    private FormSecurityDTO formSecurity;
    private CommonStatusUpdateDTO restaurant;
}
