package vn.tuhoc.vinaeatery.modules.auth.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthLoginRequestDTO {
    @NotBlank(message = "Tên tài khoản không được để trống!")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống!")
    String password;
}
