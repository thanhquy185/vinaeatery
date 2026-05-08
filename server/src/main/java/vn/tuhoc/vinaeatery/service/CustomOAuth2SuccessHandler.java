package vn.tuhoc.vinaeatery.service;

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
import vn.tuhoc.vinaeatery.domain.dto.RestLoginDTO;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.repository.UserRepository;
import vn.tuhoc.vinaeatery.util.SecurityUtil;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final UserService userService;
    private final SecurityUtil securityUtil;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long jwtRefreshTokenExpiration;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        User user = this.userRepository.findOneByUsername(email);
        if (user == null) {
            throw new Error("Tài khoản người dùng không tồn tại");
        }

        boolean isNewUser = (user.getMethod() == null); // hoặc điều kiện bạn muốn

        // Nếu là user MỚI → không set token, không cookie
        if (isNewUser) {
            String redirectUrl = "http://localhost:5173/public/profile";
            response.sendRedirect(redirectUrl);
            return;
        }

        // Nếu user đã tồn tại → tạo token và cookie như cũ
        RestLoginDTO restLogin = new RestLoginDTO();

        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin();
        userLogin.setId(user.getId());
        userLogin.setCreateAt(user.getCreateAt());
        userLogin.setRole(user.getRole());
        userLogin.setUsername(user.getUsername());
        userLogin.setMethod(user.getMethod());
        userLogin.setIsUsing(user.getIsUsing());
        userLogin.setStatus(user.getStatus());
        
        restLogin.setUserLogin(userLogin);

        String accessToken = this.securityUtil.createAccessToken(user.getUsername(), restLogin);
        restLogin.setAccessToken(accessToken);

        String refreshToken = this.securityUtil.createRefreshToken(user.getUsername(), restLogin);
        userService.changeRefreshToken(user.getUsername(), refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(false)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(jwtRefreshTokenExpiration * 365)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        String redirectUrl = "http://localhost:5173/public";

        response.sendRedirect(redirectUrl);
    }

}
