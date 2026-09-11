package vn.tuhoc.vinaeatery.customs;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthLoginResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.AuthSessionServiceImplement;
import vn.tuhoc.vinaeatery.modules.auth.services.UserServiceImplement;
import vn.tuhoc.vinaeatery.utils.SecurityUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandlerCustom implements AuthenticationSuccessHandler {
    @Value("${jwt.access-token-validity-in-seconds}")
    private long jwtRefreshTokenExpiration;
    private final UserServiceImplement userService;
    private final AuthSessionServiceImplement authSessionService;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        UserEntity user = this.userService.handleGetByUsername(email);

        boolean isNewUser = (user.getMethod() == null); // hoặc điều kiện bạn muốn

        // Nếu là user MỚI → không set token, không cookie
        if (isNewUser) {
            String redirectUrl = "http://localhost:5173/public/profile";
            response.sendRedirect(redirectUrl);

            return;
        }

        // Nếu user đã tồn tại → tạo token và cookie như cũ
        AuthLoginResponseDTO restLogin = new AuthLoginResponseDTO();

        UserInfoResponseDTO userInfo = UserInfoResponseDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .username(user.getUsername())
                .method(user.getMethod())
                .status(user.getStatus())
                .build();
        restLogin.setUserInfo(userInfo);

        String accessToken = this.securityUtil.createAccessToken(user.getUsername(), restLogin);
        restLogin.setAccessToken(accessToken);

        AuthSessionEntity authSessionEntity = this.authSessionService.handleGetByUserIdAndRevokedIsNull(user.getId());
        String currentRefreshToken = ValidationUtil.nonNull(authSessionEntity)
                ? authSessionEntity.getRefreshToken()
                : null;
        String newRefreshToken = this.securityUtil.createRefreshToken(user.getUsername(), restLogin);
        this.authSessionService.handleChangeRefreshToken(user.getId(), currentRefreshToken, newRefreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(this.jwtRefreshTokenExpiration)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        String redirectUrl = "http://localhost:5173/public";
        response.sendRedirect(redirectUrl);
    }

}
