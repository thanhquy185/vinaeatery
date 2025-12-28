package vn.tuhoc.vinaeatery.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.UserChangePasswordDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserChangePasswordRequest {
    FormSecurityDTO formSecurity;
    UserChangePasswordDTO user;
}
