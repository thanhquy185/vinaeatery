package vn.tuhoc.vinaeatery.modules.auth.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthLoginRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthLoginResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthAccessTokenIsNotValidException;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.services.EmployeeService;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.services.EmailService;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.services.CustomerService;
import vn.tuhoc.vinaeatery.modules.restaurant.services.ManagerService;
import vn.tuhoc.vinaeatery.utils.SecurityUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
        @Value("${jwt.refresh-token-validity-in-seconds}")
        private Long jwtRefreshTokenExpiration;
        private final UserService userService;
        private final ManagerService managerService;
        private final CustomerService customerService;
        private final EmployeeService employeeService;
        private final EmailService emailService;
        private final SecurityUtil securityUtil;
        private final AuthenticationManager authenticationManager;

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

        public AuthLoginResponseDTO handleLogin(AuthLoginRequestDTO authLoginRequestDTO) {
                // Lấy ra tên tài khoản, mật khẩu và tạo thông tin đăng nhập
                String usernameRequest = authLoginRequestDTO.getUsername();
                String passwordRequest = authLoginRequestDTO.getPassword();
                UserEntity currentUser = this.userService.getOneByUsernameForLogin(usernameRequest);

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
                restLogin.setAccessToken(this.securityUtil.createAccessToken(currentUser.getUsername(), restLogin));

                // Tạo refresh token
                String refreshToken = this.securityUtil.createRefreshToken(currentUser.getUsername(), restLogin);
                this.userService.handleChangeRefreshToken(currentUser.getUsername(), refreshToken);
                restLogin.setRefreshToken(refreshToken);

                // Tạo cookie
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", restLogin.getRefreshToken())
                                .httpOnly(false) // Chỉ cho phép phía server được sử dụng (tạm cho client-web)
                                .secure(true) // Chỉ cho phép https
                                .path("/") // Cho phép tất cả đường dẫn
                                .sameSite("None") // quan trọng để cookie gửi qua cross-site
                                .maxAge(jwtRefreshTokenExpiration * 365) //
                                .build();
                restLogin.setResponseCookie(responseCookie);

                return restLogin;
        }

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

        public AuthLoginResponseDTO handleRefreshToken(String refreshToken) {
                // Truy username từ refresh token để lấy ra thông tin tài khoản
                Jwt decodedJwt = this.securityUtil.checkValidRefreshToken(refreshToken);
                String username = decodedJwt.getSubject();
                UserEntity currentUser = this.userService.getOneByUsernameAndRefreshToken(username, refreshToken);

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
                restLogin.setAccessToken(this.securityUtil.createAccessToken(currentUser.getUsername(), restLogin));

                // Tạo refresh token mới
                String newRefreshToken = this.securityUtil.createRefreshToken(currentUser.getUsername(), restLogin);
                this.userService.handleChangeRefreshToken(currentUser.getUsername(), newRefreshToken);
                restLogin.setRefreshToken(newRefreshToken);

                // Tạo cookie mới
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", restLogin.getRefreshToken())
                                .httpOnly(false) // Chỉ cho phép phía server được sử dụng (tạm cho client-web)
                                .secure(true) // Chỉ cho phép https
                                .path("/") // Cho phép tất cả đường dẫn
                                .sameSite("None") // quan trọng để cookie gửi qua cross-site
                                .maxAge(jwtRefreshTokenExpiration * 365) //
                                .build();
                restLogin.setResponseCookie(responseCookie);

                return restLogin;
        }

        public AuthLoginResponseDTO handleLogout() {
                String username = this.securityUtil.getCurrentUserLogin().isPresent()
                                ? this.securityUtil.getCurrentUserLogin().get()
                                : null;
                if (username.isBlank() || username.isEmpty()) {
                        throw new AuthAccessTokenIsNotValidException();
                }
                this.userService.handleChangeRefreshToken(username, null);

                ResponseCookie responseCookie = ResponseCookie
                                .from("refreshToken", null)
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
