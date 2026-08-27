package vn.tuhoc.vinaeatery.modules.auth.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthSessionCreateRequestDTO {
    @NotNull(message = "Mã người dùng không được để trống!")
    private Integer userId;

    @NotNull(message = "Ngày tạo không được để trống!")
    private String createAt;

    @NotNull(message = "Ngày hết hạn không được để trống!")
    private String expiredAt;

    @NotNull(message = "Mã refresh token không được để trống!")
    private String refreshToken;
}
