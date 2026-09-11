package vn.tuhoc.vinaeatery.modules.auth.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.converters.UserMethodConverter;
import vn.tuhoc.vinaeatery.modules.auth.domains.converters.UserRoleConverter;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequestDTO {
    @NotNull(message = "Quyền không được để trống!")
    @Convert(converter = UserRoleConverter.class)
    UserRoleEnum role;

    @NotBlank(message = "Tên tài khoản không được để trống!")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống!")
    String password;

    @NotNull(message = "Phương thức tạo tài khoản không được để trống!")
    @Convert(converter = UserMethodConverter.class)
    UserMethodEnum method;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
