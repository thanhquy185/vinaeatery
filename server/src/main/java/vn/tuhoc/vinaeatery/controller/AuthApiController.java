package vn.tuhoc.vinaeatery.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.tuhoc.vinaeatery.domain.dto.RestLoginDTO;
import vn.tuhoc.vinaeatery.domain.dto.SignUpDTO;
import vn.tuhoc.vinaeatery.domain.entity.Customer;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.EmailService;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.ManagerService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UserService;
import vn.tuhoc.vinaeatery.domain.dto.CustomerDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.LoginDTO;
import vn.tuhoc.vinaeatery.domain.dto.ManagerDTO;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.SecurityUtil;
import vn.tuhoc.vinaeatery.util.ValidationUtil;
import vn.tuhoc.vinaeatery.util.exceptions.IdInvalidException;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
        // Properties
        private final AuthenticationManagerBuilder authenticationManagerBuilder;
        private final SecurityUtil securityUtil;
        private final PasswordEncoder passwordEncoder;
        private final UserService userService;
        private final ManagerService managerService;
        private final EmployeeService employeeService;
        private final CustomerService customerService;
        private final EmailService emailService;
        @Value("${jwt.refresh-token-validity-in-seconds}")
        private Long jwtRefreshTokenExpiration;

        // Controllers
        public AuthApiController(AuthenticationManagerBuilder authenticationManagerBuilder,
                        SecurityUtil securityUtil,
                        PasswordEncoder passwordEncoder,
                        UserService userService,
                        ManagerService managerService,
                        EmployeeService employeeService,
                        CustomerService customerService,
                        TimeService timeService,
                        EmailService emailService) {
                this.authenticationManagerBuilder = authenticationManagerBuilder;
                this.securityUtil = securityUtil;
                this.passwordEncoder = passwordEncoder;
                this.userService = userService;
                this.managerService = managerService;
                this.employeeService = employeeService;
                this.customerService = customerService;
                this.emailService = emailService;
        }

        // Methods
        @PostMapping("/customer-sign-up")
        public ResponseEntity<?> handleSignUp(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("sign-up") @Valid SignUpDTO signUpDTO, BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "auth", "sign-up")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        HandleFormSecurity.getErrorMessageByHandleFormData()));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                // Nếu tên tài khoản đã tồn tại thì báo lỗi
                User userExistsByUsername = this.userService.getOneByUsername(signUpDTO.getUsername());
                if (userExistsByUsername != null && userExistsByUsername.getId() > 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr("Tên tài khoản đã tồn tại!"));
                }
                // Nếu số điện thoại đã tồn tại thì báo lỗi
                Customer customerExistsByPhone = this.customerService.getOneByPhone(signUpDTO.getPhone());
                if (customerExistsByPhone != null && customerExistsByPhone.getId() > 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr("Số điện thoại đã tồn tại!"));
                }
                // Nếu email đã tồn tại thì báo lỗi
                Customer customerExistsByEmail = this.customerService.getOneByEmail(signUpDTO.getEmail());
                if (customerExistsByEmail != null && customerExistsByEmail.getId() > 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr("Email đã tồn tại!"));
                }
                // Nếu mật khẩu và Mật khẩu lần 2 không khớp thì báo lỗi
                if (!signUpDTO.getPassword().equals(signUpDTO.getAuthPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Mật khẩu và Mật khẩu lần 2 không khớp!"));
                }

                // Mã hoá mật khẩu
                String hashPassword = this.passwordEncoder.encode(signUpDTO.getPassword());

                // Tạo người dùng mới
                User newUser = new User();
                newUser.setCreateAt(signUpDTO.getCreateAt());
                newUser.setRole(UserRoleEnum.CUSTOMER);
                newUser.setUsername(signUpDTO.getUsername());
                newUser.setPassword(hashPassword);
                newUser.setMethod(UserMethodEnum.HANDMADE);
                newUser.setIsUsing(UserIsUsingEnum.USING);
                newUser.setStatus(CommonStatusEnum.ACTIVE);
                User handleCreateNewUser = this.userService.upsert(newUser);

                // Tạo khách hàng mới
                CustomerDTO infoCustomerCreated = null;
                if (handleCreateNewUser != null && handleCreateNewUser.getId() > 0) {
                        Customer newCustomer = new Customer();
                        newCustomer.setUserId(handleCreateNewUser.getId());
                        newCustomer.setCreateAt(signUpDTO.getCreateAt());
                        newCustomer.setFullname(signUpDTO.getFullname());
                        newCustomer.setPhone(signUpDTO.getPhone());
                        newCustomer.setEmail(signUpDTO.getEmail());
                        newCustomer.setStatus(CommonStatusEnum.ACTIVE);
                        Customer handleCreateNewCustomer = this.customerService.upsert(newCustomer);

                        if (handleCreateNewCustomer != null) {
                                this.emailService.sendRegisterSuccessEmail(handleCreateNewCustomer.getEmail(),
                                                handleCreateNewUser, handleCreateNewCustomer, signUpDTO.getPassword());

                                // if(handleCreateNewCustomer == null || handleCreateNewCustomer.getId() <= 0) {
                                // // Xoá user nếu tạo khách hàng không thành công
                                // this.userService.deleteById(handleCreateNewUser.getId());
                                // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                // .body(ValidationUtil.buildRestResponseWithStr(
                                // "Đã có lỗi xảy ra trong quá trình tạo tài khoản. Vui lòng thử lại!"));
                                // } else {
                                // infoCustomerCreated =
                                // this.customerService.getOneFormatById(handleCreateNewCustomer.getId());
                                // }

                                infoCustomerCreated = this.customerService
                                                .getOneFormatById(handleCreateNewCustomer.getId());
                        }

                }

                return ResponseEntity.status(HttpStatus.OK).body(infoCustomerCreated);
        }

        @PostMapping("/login")
        public ResponseEntity<?> handleLogin(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("account") @Valid LoginDTO loginDTO, BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "auth", "login")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        HandleFormSecurity.getErrorMessageByHandleFormData()));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }
                if (userService.getOneByUsername(loginDTO.getUsername()) == null || !passwordEncoder.matches(
                                loginDTO.getPassword(),
                                userService.getOneByUsername(loginDTO.getUsername()).getPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Tên tài khoản hoặc mật khẩu không đúng!"));
                }
                if (userService.getOneByUsername(loginDTO.getUsername()).getStatus() == CommonStatusEnum.INACTIVE) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Tài khoản đã bị khoá, không thể đăng nhập!"));
                }
                if (userService.getOneByUsername(loginDTO.getUsername()).getIsUsing() == UserIsUsingEnum.NOTUSING) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Tài khoản này chưa được cấp để sử dụng!"));
                }

                // Nạp input vào security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                loginDTO.getUsername(), loginDTO.getPassword());

                // Xác thực người dùng
                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);

                // Nạp thông tin
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Tạo Rest Login DTO
                RestLoginDTO restLogin = new RestLoginDTO();
                User currentUser = this.userService.getOneByUsername(loginDTO.getUsername());
                if (currentUser != null) {
                        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin();
                        userLogin.setId(currentUser.getId());
                        userLogin.setCreateAt(currentUser.getCreateAt());
                        userLogin.setRole(currentUser.getRole());
                        userLogin.setUsername(currentUser.getUsername());
                        userLogin.setMethod(currentUser.getMethod());
                        userLogin.setIsUsing(currentUser.getIsUsing());
                        userLogin.setStatus(currentUser.getStatus());

                        restLogin.setUserLogin(userLogin);
                }
                restLogin.setAccessToken(this.securityUtil.createAccessToken(loginDTO.getUsername(), restLogin));

                // Tạo refresh token
                String refreshToken = this.securityUtil.createRefreshToken(loginDTO.getUsername(), restLogin);
                this.userService.changeRefreshToken(currentUser.getUsername(), refreshToken);

                // Tạo cookie
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
                                .httpOnly(false) // Chỉ cho phép phía server được sử dụng (tạm cho client-web)
                                .secure(true) // Chỉ cho phép https
                                .path("/") // Cho phép tất cả đường dẫn
                                .sameSite("None") // quan trọng để cookie gửi qua cross-site
                                .maxAge(jwtRefreshTokenExpiration * 365) //
                                .build();

                return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                                responseCookie.toString()).body(restLogin);
        }

        @PostMapping("/account")
        public ResponseEntity<?> getAccount(@RequestBody FormSecurityDTO formSecurityDTO) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "auth", "account")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        HandleFormSecurity.getErrorMessageByHandleFormData()));
                }

                String username = SecurityUtil.getCurrentUserLogin().isPresent()
                                ? SecurityUtil.getCurrentUserLogin().get()
                                : null;
                User currentUser = this.userService.getOneByUsername(username);

                boolean isAdminLogin = currentUser.getRole() == UserRoleEnum.ADMIN;
                boolean isManagerLogin = currentUser.getRole() == UserRoleEnum.MANAGER;
                boolean isEmployeeLogin = currentUser.getRole() == UserRoleEnum.EMPLOYEE;
                boolean isCustomerLogin = currentUser.getRole() == UserRoleEnum.CUSTOMER;
                ManagerDTO managerInfo = null;
                EmployeeDTO employeeInfo = null;
                CustomerDTO customerInfo = null;

                if (currentUser != null) {
                        if (isAdminLogin) {

                        } else if (isManagerLogin) {
                                managerInfo = this.managerService.getOneByUserId(currentUser.getId());
                        } else if (isEmployeeLogin) {
                                employeeInfo = this.employeeService.getOneByUserId(currentUser.getId());
                        } else if (isCustomerLogin) {
                                customerInfo = this.customerService.getOneByUserId(currentUser.getId());
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(isAdminLogin ? currentUser
                                : isManagerLogin ? managerInfo : isEmployeeLogin ? employeeInfo : customerInfo);
        }

        @GetMapping("/refresh")
        public ResponseEntity<?> handleRefresh(@CookieValue("refreshToken") String refreshToken)
                        throws IdInvalidException {
                Jwt decodedJwt = this.securityUtil.checkValidRefreshToken(refreshToken);
                String username = decodedJwt.getSubject();
                User currentUser = this.userService.getOneByUsernameAndRefreshToken(username, refreshToken);
                if (currentUser != null) {
                        RestLoginDTO restLogin = new RestLoginDTO();

                        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin();
                        userLogin.setId(currentUser.getId());
                        userLogin.setCreateAt(currentUser.getCreateAt());
                        userLogin.setRole(currentUser.getRole());
                        userLogin.setUsername(currentUser.getUsername());
                        userLogin.setMethod(currentUser.getMethod());
                        userLogin.setIsUsing(currentUser.getIsUsing());
                        userLogin.setStatus(currentUser.getStatus());

                        restLogin.setUserLogin(userLogin);

                        restLogin.setAccessToken(this.securityUtil.createAccessToken(username, restLogin));

                        // Tạo refresh token
                        String newRefreshToken = this.securityUtil.createRefreshToken(username, restLogin);
                        this.userService.changeRefreshToken(username, newRefreshToken);

                        // Tạo cookie
                        ResponseCookie respCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                                        .httpOnly(true) // Chỉ cho phép phía server được sử dụng
                                        .secure(true) // Chỉ cho phép https
                                        .path("/") // Cho phép tất cả đường dẫn
                                        .maxAge(jwtRefreshTokenExpiration * 365) //
                                        .build();

                        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, respCookie.toString())
                                        .body(restLogin);
                }
                {
                        throw new IdInvalidException(username);
                }
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(@RequestBody FormSecurityDTO formSecurityDTO) throws IdInvalidException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "auth", "logout")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        HandleFormSecurity.getErrorMessageByHandleFormData()));
                }

                String username = SecurityUtil.getCurrentUserLogin().isPresent()
                                ? SecurityUtil.getCurrentUserLogin().get()
                                : "";
                if (username.equals("")) {
                        throw new IdInvalidException("Access token is not valid");
                }
                this.userService.changeRefreshToken(username, null);

                ResponseCookie deleteSpringCookie = ResponseCookie
                                .from("refreshToken", null)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(0)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
                                .body(null);
        }

}