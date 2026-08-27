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
public class AuthSessionUpdateRevokedAtRequestDTO {
    @NotNull(message = "Mã người dùng không được để trống!")
    private Integer userId;

    @NotNull(message = "Mã refresh token không được để trống!")
    private String refreshToken;
}
