package vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerRegisterRequestDTO {
    @NotNull(message = "Mã tài khoản không được để trống!")
    Integer userId;

    String image;

    @NotBlank(message = "Họ và tên không được để trống!")
    String fullname;

    @NotBlank(message = "Ngày sinh không được để trống!")
    String birthdate;

    @NotNull(message = "Giới tính không được để trống!")
    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    String phone;

    @NotBlank(message = "Email không được để trống!")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    String email;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;
}
