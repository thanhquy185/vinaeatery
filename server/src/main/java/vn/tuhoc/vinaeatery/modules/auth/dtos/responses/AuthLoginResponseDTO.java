package vn.tuhoc.vinaeatery.modules.auth.dtos.responses;

import org.springframework.http.ResponseCookie;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthLoginResponseDTO {
    @JsonProperty("access_token")
    private String accessToken;

    private String refreshToken;

    private ResponseCookie responseCookie;

    private UserInfoResponseDTO userInfo;
}