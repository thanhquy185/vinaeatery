package vn.tuhoc.vinaeatery.modules.auth.dtos.responses;

import org.springframework.http.ResponseCookie;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class AuthLoginResponseDTO {
    String accessToken;

    @JsonIgnore
    ResponseCookie responseCookie;

    UserInfoResponseDTO userInfo;
}