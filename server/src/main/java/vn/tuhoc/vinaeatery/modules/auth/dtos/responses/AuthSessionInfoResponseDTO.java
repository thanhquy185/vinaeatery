package vn.tuhoc.vinaeatery.modules.auth.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthSessionInfoResponseDTO {
    private Integer id;

    private String createdAt;

    private String expiredAt;

    private String revokedAt;

    private String refreshToken;
}
