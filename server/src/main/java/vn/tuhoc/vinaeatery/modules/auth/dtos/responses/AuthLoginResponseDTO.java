package vn.tuhoc.vinaeatery.modules.auth.dtos.responses;

import org.springframework.http.ResponseCookie;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthLoginResponseDTO {
    private String accessToken;

    @JsonIgnore
    private ResponseCookie responseCookie;

    private UserInfoResponseDTO userInfo;
}