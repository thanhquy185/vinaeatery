package vn.tuhoc.vinaeatery.modules.auth.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserChangePasswordRequestDTO {
    @NotBlank(message = "Mật khẩu mới không được để trống!")
    private String newPassword;

    @NotBlank(message = "Mật khẩu mới lần 2 không được để trống!")
    private String newPassword2;
}
