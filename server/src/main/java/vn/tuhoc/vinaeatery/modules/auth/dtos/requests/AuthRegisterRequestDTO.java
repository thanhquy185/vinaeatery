package vn.tuhoc.vinaeatery.modules.auth.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthRegisterRequestDTO {
    @NotBlank(message = "Tên tài khoản không được để trống!")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống!")
    String password;

    @NotBlank(message = "Mật khẩu lần 2 không được để trống!")
    String password2;

    @NotBlank(message = "Họ và tên không được để trống!")
    String customerFullname;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    String customerPhone;

    @NotBlank(message = "Email không được để trống!")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    String customerEmail;
}
