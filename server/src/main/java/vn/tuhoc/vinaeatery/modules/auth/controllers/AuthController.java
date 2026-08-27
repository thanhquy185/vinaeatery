package vn.tuhoc.vinaeatery.modules.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthLoginResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthLoginRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.AuthService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
        private final AuthService authService;

        @PostMapping("/customer/register")
        public ResponseEntity<RestResponseDTO<CustomerDetailResponseDTO>> handleSignUp(
                        @RequestBody @Valid AuthRegisterRequestDTO authRegisterRequestDTO) {
                CustomerDetailResponseDTO customerFormatCreated = this.authService
                                .handleCustomerRegister(authRegisterRequestDTO);

                return RestResponseUtils.created(
                                "Đăng ký tài khoản thành công!",
                                customerFormatCreated);
        }

        @PostMapping("/get-info")
        public ResponseEntity<RestResponseDTO<Object>> handleRefreshToken() {
                Object info = this.authService.handleGetInfo();

                return RestResponseUtils.ok(
                                "Truy thông tin tài khoản thành công!",
                                info);
        }

        @PostMapping("/login")
        public ResponseEntity<RestResponseDTO<AuthLoginResponseDTO>> handleLogin(
                        @RequestBody @Valid AuthLoginRequestDTO authLoginRequestDTO) {
                AuthLoginResponseDTO restLogin = this.authService.handleLogin(authLoginRequestDTO);

                return RestResponseUtils.okWithCookie(
                                restLogin.getResponseCookie().toString(),
                                "Đăng nhập tài khoản thành công!",
                                restLogin);
        }

        @PostMapping("/refresh-token")
        public ResponseEntity<RestResponseDTO<AuthLoginResponseDTO>> handleRefreshToken(
                        @CookieValue("refreshToken") String refreshToken) {
                AuthLoginResponseDTO restLogin = this.authService.handleRefreshToken(refreshToken);

                return RestResponseUtils.okWithCookie(
                                restLogin.getResponseCookie().toString(),
                                "Thay đổi refresh token tài khoản thành công!",
                                restLogin);
        }

        @PostMapping("/logout")
        public ResponseEntity<RestResponseDTO<Object>> logout(
                        @CookieValue("refreshToken") String refreshToken) {
                AuthLoginResponseDTO restLogin = this.authService.handleLogout(refreshToken);

                return RestResponseUtils.okWithCookie(
                                restLogin.getResponseCookie().toString(),
                                "Đăng xuất tài khoản thành công!",
                                restLogin);
        }
}