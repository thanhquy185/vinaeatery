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
import vn.tuhoc.vinaeatery.service.RoleService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.RoleHistoryService;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.LoginDTO;
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
        private final TimeService timeService;
        private final RoleService roleService;
        private final RoleHistoryService roleHistoryService;
        private final EmployeeService employeeService;
        @Value("${jwt.refresh-token-validity-in-seconds}")
        private Long jwtRefreshTokenExpiration;

        // Controllers
        public AuthApiController(AuthenticationManagerBuilder authenticationManagerBuilder,
                        SecurityUtil securityUtil,
                        PasswordEncoder passwordEncoder,
                        TimeService timeService,
                        RoleService roleService,
                        RoleHistoryService roleHistoryService,
                        EmployeeService employeeService) {
                this.authenticationManagerBuilder = authenticationManagerBuilder;
                this.securityUtil = securityUtil;
                this.passwordEncoder = passwordEncoder;
                this.timeService = timeService;
                this.roleService = roleService;
                this.roleHistoryService = roleHistoryService;
                this.employeeService = employeeService;
        }

        // Methods
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
                if (employeeService.getOneByUsername(loginDTO.getUsername()) == null || !passwordEncoder.matches(
                                loginDTO.getPassword(),
                                employeeService.getOneByUsername(loginDTO.getUsername()).getPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Tên tài khoản hoặc mật khẩu không đúng !"));
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
                Employee currentEmployee = this.employeeService.getOneByUsername(loginDTO.getUsername());
                if (currentEmployee != null) {
                        RestLoginDTO.EmployeeLogin employeeLogin = new RestLoginDTO.EmployeeLogin();
                        employeeLogin.setId(currentEmployee.getId());
                        employeeLogin.setImage(currentEmployee.getImage());
                        employeeLogin.setFullname(currentEmployee.getFullname());
                        employeeLogin.setBirthday(currentEmployee.getBirthday());
                        employeeLogin.setGender(currentEmployee.getGender());
                        employeeLogin.setPhone(currentEmployee.getPhone());
                        employeeLogin.setEmail(currentEmployee.getEmail());
                        employeeLogin.setAddress(currentEmployee.getAddress());
                        employeeLogin.setUsername(currentEmployee.getUsername());
                        employeeLogin.setRole(roleService
                                        .getOneById(roleHistoryService.getNewByEmployeeId(currentEmployee.getId())
                                                        .getId().getRoleId()));

                        restLogin.setEmployeeLogin(employeeLogin);
                }
                restLogin.setAccessToken(this.securityUtil.createAccessToken(loginDTO.getUsername(), restLogin));

                // Tạo refresh token
                String refreshToken = this.securityUtil.createRefreshToken(loginDTO.getUsername(), restLogin);
                this.employeeService.changeRefreshToken(currentEmployee.getUsername(), refreshToken);

                // Tạo cookie
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
                                .httpOnly(false) // Chỉ cho phép phía backend được sử dụng (tạm cho frontend)
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

                String username = SecurityUtil.getCurrentEmployeeLogin().isPresent()
                                ? SecurityUtil.getCurrentEmployeeLogin().get()
                                : null;
                // System.out.println(username);
                Employee currentEmployeeDB = this.employeeService.getOneByUsername(username);
                // RestLoginDTO.EmployeeLogin employeeLogin = new RestLoginDTO.EmployeeLogin();
                // RestLoginDTO.EmployeeGetAccount employeeGetAccount = new
                // RestLoginDTO.EmployeeGetAccount();
                // if (currentEmployeeDB != null) {
                // employeeLogin.setId(currentEmployeeDB.getId());
                // employeeLogin.setEmail(currentEmployeeDB.getEmail());
                // employeeLogin.setFullname(currentEmployeeDB.getFullname());

                // employeeGetAccount.setEmployeeLogin(employeeLogin);
                // }
                // return ResponseEntity.ok().body(employeeGetAccount);
                EmployeeDTO currentEmployee = new EmployeeDTO();
                if (currentEmployeeDB != null) {
                        currentEmployee = this.employeeService.getOneFormatById(currentEmployeeDB.getId());
                }

                return ResponseEntity.status(HttpStatus.OK).body(currentEmployee);
        }

        @GetMapping("/refresh")
        public ResponseEntity<?> getMethodName(@CookieValue("refreshToken") String refreshToken)
                        throws IdInvalidException {
                Jwt decodedJwt = this.securityUtil.checkValidRefreshToken(refreshToken);
                String username = decodedJwt.getSubject();
                Employee currentEmployee = this.employeeService.getOneByUsernameAndRefreshToken(username, refreshToken);
                if (currentEmployee != null) {
                        RestLoginDTO restLogin = new RestLoginDTO();

                        RestLoginDTO.EmployeeLogin employeeLogin = new RestLoginDTO().getEmployeeLogin();
                        employeeLogin.setId(currentEmployee.getId());
                        employeeLogin.setImage(currentEmployee.getImage());
                        employeeLogin.setFullname(currentEmployee.getFullname());
                        employeeLogin.setBirthday(currentEmployee.getBirthday());
                        employeeLogin.setGender(currentEmployee.getGender());
                        employeeLogin.setPhone(currentEmployee.getPhone());
                        employeeLogin.setEmail(currentEmployee.getEmail());
                        employeeLogin.setAddress(currentEmployee.getAddress());
                        employeeLogin.setUsername(currentEmployee.getUsername());
                        employeeLogin.setRole(roleService
                                        .getOneById(roleHistoryService.getNewByEmployeeId(currentEmployee.getId())
                                                        .getId().getRoleId()));

                        restLogin.setEmployeeLogin(employeeLogin);

                        restLogin.setAccessToken(this.securityUtil.createAccessToken(username, restLogin));

                        // Tạo refresh token
                        String newRefreshToken = this.securityUtil.createRefreshToken(username, restLogin);
                        this.employeeService.changeRefreshToken(username, newRefreshToken);

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

                String username = SecurityUtil.getCurrentEmployeeLogin().isPresent()
                                ? SecurityUtil.getCurrentEmployeeLogin().get()
                                : "";
                if (username.equals("")) {
                        throw new IdInvalidException("Access token is not valid");
                }
                this.employeeService.changeRefreshToken(username, null);

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