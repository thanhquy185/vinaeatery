package vn.tuhoc.vinaeatery.modules.auth.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.AuthSessionEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthLoginRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthSessionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthLoginResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.interfaces.AuthService;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.services.EmployeeServiceImplement;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.services.EmailService;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.services.CustomerServiceImplement;
import vn.tuhoc.vinaeatery.modules.restaurant.services.ManagerServiceImplement;
import vn.tuhoc.vinaeatery.utils.SecurityUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthServiceImplement implements AuthService {
        @Value("${jwt.refresh-token-validity-in-seconds}")
        Long jwtRefreshTokenExpiration;
        final AuthenticationManager authenticationManager;
        final SecurityUtil securityUtil;
        final TimeService timeService;
        final EmailService emailService;
        final UserServiceImplement userService;
        final AuthSessionServiceImplement authSessionService;
        final ManagerServiceImplement managerService;
        final CustomerServiceImplement customerService;
        final EmployeeServiceImplement employeeService;

        @Override
        public CustomerDetailResponseDTO handleCustomerRegister(AuthRegisterRequestDTO authRegisterRequestDTO) {
                // Tạo tài khoản mới (mật khẩu sẽ được mã hoá trong User Service)
                UserCreateRequestDTO userCreateRequestDTO = UserCreateRequestDTO.builder()
                                .role(UserRoleEnum.CUSTOMER)
                                .username(authRegisterRequestDTO.getUsername())
                                .password(authRegisterRequestDTO.getPassword())
                                .method(UserMethodEnum.HANDMADE)
                                .status(CommonStatusEnum.ACTIVE)
                                .build();
                UserDetailResponseDTO userCreated = this.userService.handleCreate(userCreateRequestDTO);

                // Tạo khách hàng mới
                CustomerRegisterRequestDTO customerRegisterRequestDTO = CustomerRegisterRequestDTO.builder()
                                .userId(userCreated.getId())
                                .fullname(authRegisterRequestDTO.getCustomerFullname())
                                .phone(authRegisterRequestDTO.getCustomerPhone())
                                .email(authRegisterRequestDTO.getCustomerEmail())
                                .status(CommonStatusEnum.ACTIVE)
                                .build();
                CustomerDetailResponseDTO customerCreated = this.customerService
                                .handleRegister(customerRegisterRequestDTO);

                // Thông báo đã đăng ký tài khoản thành công đến email khách hàng đăng ký
                this.emailService.sendRegisterSuccessEmail(
                                customerCreated.getEmail(),
                                userCreated,
                                customerCreated,
                                authRegisterRequestDTO.getPassword());

                // Lấy ra thông tin khách hàng mới (đã format)
                CustomerDetailResponseDTO customerDetailResponseDTO = this.customerService
                                .handleGetDetailById(customerCreated.getId());

                return customerDetailResponseDTO;
        }

        @Override
        public Object handleGetInfo() {
                String username = this.securityUtil.getCurrentUserLogin().isPresent()
                                ? this.securityUtil.getCurrentUserLogin().get()
                                : null;
                UserDetailResponseDTO currentUser = this.userService.handleGetDetailByUsername(username);

                boolean isAdminLogin = currentUser.getRole() == UserRoleEnum.ADMIN;
                boolean isManagerLogin = currentUser.getRole() == UserRoleEnum.MANAGER;
                boolean isEmployeeLogin = currentUser.getRole() == UserRoleEnum.EMPLOYEE;
                boolean isCustomerLogin = currentUser.getRole() == UserRoleEnum.CUSTOMER;
                ManagerDetailResponseDTO managerDetailResponseDTO = null;
                EmployeeDetail2ResponseDTO employeeDetail2ResponseDTO = null;
                CustomerDetailResponseDTO customerDetailResponseDTO = null;

                if (currentUser != null) {
                        if (isAdminLogin) {

                        } else if (isManagerLogin) {
                                managerDetailResponseDTO = this.managerService
                                                .handleGetDetailByUserId(currentUser.getId());
                        } else if (isEmployeeLogin) {
                                employeeDetail2ResponseDTO = this.employeeService
                                                .handleGetDetail2ByUserId(currentUser.getId());
                        } else if (isCustomerLogin) {
                                customerDetailResponseDTO = this.customerService
                                                .handleGetDetailByUserId(currentUser.getId());
                        }
                }

                return isAdminLogin ? currentUser
                                : isManagerLogin ? managerDetailResponseDTO
                                                : isEmployeeLogin ? employeeDetail2ResponseDTO
                                                                : customerDetailResponseDTO;
        }

        @Override
        public AuthLoginResponseDTO handleLogin(AuthLoginRequestDTO authLoginRequestDTO) {
                // Lấy ra tên tài khoản, mật khẩu và tạo thông tin đăng nhập
                String usernameRequest = authLoginRequestDTO.getUsername();
                String passwordRequest = authLoginRequestDTO.getPassword();
                UserEntity currentUser = this.userService.handleGetByUsernameForLogin(usernameRequest);

                // Nạp input vào security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                usernameRequest, passwordRequest);

                // Xác thực người dùng
                Authentication authentication = this.authenticationManager
                                .authenticate(authenticationToken);

                // Nạp thông tin
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Tạo Rest Login DTO
                AuthLoginResponseDTO restLogin = AuthLoginResponseDTO.builder()
                                .userInfo(UserInfoResponseDTO.builder()
                                                .id(currentUser.getId())
                                                .role(currentUser.getRole())
                                                .username(currentUser.getUsername())
                                                .method(currentUser.getMethod())
                                                .status(currentUser.getStatus())
                                                .build())
                                .build();

                // Tạo access token
                String accessToken = this.securityUtil.createAccessToken(currentUser.getUsername(), restLogin);
                restLogin.setAccessToken(accessToken);

                // Tạo refresh token
                AuthSessionEntity authSessionEntity = this.authSessionService
                                .getValidSessionByUserId(currentUser.getId());
                String refreshToken;
                if (authSessionEntity != null) {
                        refreshToken = authSessionEntity.getRefreshToken();
                } else {
                        refreshToken = this.securityUtil.createRefreshToken(currentUser.getUsername(), restLogin);

                        LocalDateTime currentDateTime = LocalDateTime.now();
                        AuthSessionCreateRequestDTO authSessionCreateRequestDTO = AuthSessionCreateRequestDTO.builder()
                                        .userId(currentUser.getId())
                                        .createAt(this.timeService.getDatetime(currentDateTime))
                                        .expiredAt(this.timeService.getDatetime(
                                                        currentDateTime.plusSeconds(this.jwtRefreshTokenExpiration)))
                                        .refreshToken(refreshToken)
                                        .build();
                        this.authSessionService.handleCreate(authSessionCreateRequestDTO);
                }

                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
                                .httpOnly(true) // Chỉ cho phép phía server được sử dụng (tạm cho client-web)
                                .secure(true) // Chỉ cho phép https
                                .path("/") // Cho phép tất cả đường dẫn
                                .sameSite("None") // quan trọng để cookie gửi qua cross-site
                                .maxAge(this.jwtRefreshTokenExpiration) //
                                .build();
                restLogin.setResponseCookie(responseCookie);

                return restLogin;
        }

        @Override
        public AuthLoginResponseDTO handleRefreshToken(String refreshToken) {
                // Truy auth session từ refresh token để lấy ra thông tin tài khoản
                AuthSessionEntity currentAuthSession = this.authSessionService
                                .getValidSessionByRefreshToken(refreshToken);
                UserEntity currentUser = currentAuthSession.getUser();

                // Tạo Rest Login DTO
                AuthLoginResponseDTO restLogin = AuthLoginResponseDTO.builder()
                                .userInfo(UserInfoResponseDTO.builder()
                                                .id(currentUser.getId())
                                                .role(currentUser.getRole())
                                                .username(currentUser.getUsername())
                                                .method(currentUser.getMethod())
                                                .status(currentUser.getStatus())
                                                .build())
                                .build();

                // Tạo access token mới
                String newAccessToken = this.securityUtil.createAccessToken(currentUser.getUsername(), restLogin);
                restLogin.setAccessToken(newAccessToken);

                // Tạo refresh token mới nếu token của session hiện tại chưa bị thu hồi
                String newRefreshToken = currentAuthSession.getRefreshToken();
                if (ValidationUtil.nonNull(currentAuthSession.getRevokedAt())) {
                        newRefreshToken = this.securityUtil.createRefreshToken(
                                        currentUser.getUsername(),
                                        restLogin);
                        this.authSessionService.handleChangeRefreshToken(
                                        currentUser.getId(),
                                        refreshToken,
                                        newRefreshToken);
                }

                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                                .httpOnly(true) // Chỉ cho phép phía server được sử dụng (tạm cho client-web)
                                .secure(true) // Chỉ cho phép https
                                .path("/") // Cho phép tất cả đường dẫn
                                .sameSite("None") // quan trọng để cookie gửi qua cross-site
                                .maxAge(this.jwtRefreshTokenExpiration) //
                                .build();
                restLogin.setResponseCookie(responseCookie);

                return restLogin;
        }

        @Override
        public AuthLoginResponseDTO handleLogout(String refreshToken) {
                // Truy auth session từ refresh token để lấy ra thông tin tài khoản
                AuthSessionEntity currentAuthSession = this.authSessionService
                                .getValidSessionByRefreshToken(refreshToken);
                currentAuthSession.setRevokedAt(this.timeService.getCurrentDatetime());

                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", null)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(0)
                                .build();

                AuthLoginResponseDTO restLogin = AuthLoginResponseDTO.builder()
                                .responseCookie(responseCookie)
                                .build();

                return restLogin;
        }
}
