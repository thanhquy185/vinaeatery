package vn.tuhoc.vinaeatery.customs;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2FailureHandlerCustom implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        String message = URLEncoder.encode("Lỗi, xác thực OAuth2!", StandardCharsets.UTF_8);
        String redirectUrl = "http://localhost:5173/public?error=" + message;
        
        response.sendRedirect(redirectUrl);
    }
}