package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeChangePasswordDTO {
    // Properties
    @NotNull(message = "Mật khẩu hiện tại không được để trống !")
    private String currentPassword;
    @NotNull(message = "Mật khẩu mới không được để trống !")
    private String newPassword;
    @NotNull(message = "Xác nhận mật khẩu mới không được để trống !")
    private String authNewPassword;
    private LocalDateTime timeUpdate;
}
