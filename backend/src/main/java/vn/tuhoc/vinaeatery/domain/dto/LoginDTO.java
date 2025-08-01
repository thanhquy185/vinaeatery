package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginDTO {
    // Properties
    @NotNull(message = "Tên tài khoản không được để trống !")
    private String username;
    @NotNull(message = "Mật khẩu không được để trống !")
    private String password;
}
