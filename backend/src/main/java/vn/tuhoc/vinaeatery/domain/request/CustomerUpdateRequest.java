package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.CustomerUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CustomerUpdateRequest {
    private FormSecurityDTO formSecurity;
    private CustomerUpdateDTO customer;   
}
