package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.UserChangePasswordRequest;
import vn.tuhoc.vinaeatery.domain.request.UserCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.UserLockRequest;
import vn.tuhoc.vinaeatery.domain.request.UserUpdateRequest;
import vn.tuhoc.vinaeatery.service.UserService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserApiController {
        // Properties
        private final UserService userService;
        private final PasswordEncoder passwordEncoder;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listUser(@RequestBody FormSecurityDTO formSecurityDTO,
                        UserCriteria userCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "users", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<User> listUser = this.userService.getAll(userCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listUser);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailUser(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "users", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                User userSelected = this.userService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(userSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateUser(@RequestBody @Valid UserCreateRequest userCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(userCreateRequest.getFormSecurity(), "users", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (userCreateRequest.getUser() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tài khoản không được để trống!"));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                User userExistsByUsername = this.userService
                                .getOneByUsername(userCreateRequest.getUser().getUsername());
                if (userExistsByUsername != null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr("Tên tài khoản đã tồn tại!"));
                }

                User userCreated = this.userService.upsert(userCreateRequest.getUser());
                if (userCreated != null) {
                        userCreated.setPassword(this.passwordEncoder.encode(userCreateRequest.getUser().getPassword()));
                        this.userService.upsert(userCreated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(userCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateUser(@PathVariable("id") Integer id,
                        @RequestBody @Valid UserUpdateRequest userUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(userUpdateRequest.getFormSecurity(), "users", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (userUpdateRequest.getUser() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tài khoản không được để trống!"));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                User userUpdated = this.userService.getOneById(id);
                if (userUpdated != null) {
                        userUpdated.setRole(userUpdateRequest.getUser().getRole());
                        // userUpdated.setMethod(userUpdateRequest.getUser().getMethod());
                       
                        this.userService.upsert(userUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(userUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockUser(@PathVariable("id") Integer id,
                        @RequestBody @Valid UserLockRequest userLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(userLockRequest.getFormSecurity(), "users", "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (userLockRequest.getUser() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tài khoản không được để trống!"));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CommonStatusEnum handleStatus = userLockRequest.getUser().getStatus() == CommonStatusEnum.ACTIVE
                                ? CommonStatusEnum.INACTIVE
                                : CommonStatusEnum.ACTIVE;
                
                User userLocked = this.userService.getOneById(id);
                if (userLocked != null) {
                        userLocked.setStatus(handleStatus);

                        this.userService.lock(userLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(userLocked);
        }

        @PutMapping(value = "/change-password/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleChangeEmployeePassword(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid UserChangePasswordRequest userChangePasswordRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(userChangePasswordRequest.getFormSecurity(), "users",
                                "change-password")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (userChangePasswordRequest.getUser() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tài khoản không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                User userUpdatePassword = this.userService.getOneById(id);
                if (userUpdatePassword != null) {
                        if (!userChangePasswordRequest.getUser().getNewPassword()
                                        .equals(userChangePasswordRequest.getUser().getAuthNewPassword())) {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(ValidationUtil.buildRestResponseWithStr(
                                                                "Xác nhận mật khẩu mới không đúng!"));
                        }

                        userUpdatePassword.setPassword(
                                        this.passwordEncoder
                                                        .encode(userChangePasswordRequest.getUser().getNewPassword()));

                        this.userService.upsert(userUpdatePassword);
                }

                return ResponseEntity.status(HttpStatus.OK).body(userUpdatePassword);
        }
}