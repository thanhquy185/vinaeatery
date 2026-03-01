package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignUpDTO {
    @NotNull(message = "Thời gian tạo không được để trống!")
    private String createAt;
    @NotNull(message = "Tên tài khoản không được để trống!")
    private String username;
    @NotNull(message = "Mật khẩu không được để trống!")
    private String password;
    @NotNull(message = "Mật khẩu lần 2 không được để trống!")
    private String authPassword;
    @NotNull(message = "Họ và tên không được để trống!")
    private String fullname;
    @NotNull(message = "Số điện thoại không được để trống!")
    private String phone;
    @NotNull(message = "Email không được để trống!")
    private String email;
}
