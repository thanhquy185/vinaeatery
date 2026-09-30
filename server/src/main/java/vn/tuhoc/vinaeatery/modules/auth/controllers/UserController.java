package vn.tuhoc.vinaeatery.modules.auth.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserChangePasswordRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.repositories.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.modules.auth.services.interfaces.UserService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
        UserService userService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<UserDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                UserDetailResponseDTO userDetail = this.userService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn người dùng theo mã người dùng thành công!",
                                userDetail);
        }

        @GetMapping("")
        public ResponseEntity<RestResponseDTO<Page<UserSummaryResponseDTO>>> handleGetSummary(
                        UserCriteria userCriteria) {
                Page<UserSummaryResponseDTO> userSummary = this.userService.handleGetSummary(userCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách người dùng thành công!",
                                userSummary);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<UserDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid UserCreateRequestDTO userCreateRequestDTO) {
                UserDetailResponseDTO userCreated = this.userService.handleCreate(userCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm người dùng thành công!",
                                userCreated);
        }

        @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<UserDetailResponseDTO>> handleChangePassword(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid UserChangePasswordRequestDTO userChangePasswordRequestDTO) {
                UserDetailResponseDTO userChangePassword = this.userService.handleChangePassword(id,
                                userChangePasswordRequestDTO);

                return RestResponseUtils.ok(
                                "Thay đổi mật khẩu người dùng thành công!",
                                userChangePassword);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<UserDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid UserDeleteRequestDTO userDeleteRequestDTO) {
                UserDetailResponseDTO userDeleted = this.userService.handleDelete(id, userDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái người dùng thành công!",
                                userDeleted);
        }
}