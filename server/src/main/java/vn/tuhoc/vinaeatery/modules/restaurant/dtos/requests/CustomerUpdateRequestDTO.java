package vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerUpdateRequestDTO {
    String image;

    @NotBlank(message = "Họ tên quản lý không được để trống!")
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

    @NotBlank(message = "Số nhà không được để trống!")
    @Size(max = 25, message = "Số nhà không vượt quá 30 ký tự!")
    String houseNumber;

    @NotBlank(message = "Tên đường không được để trống!")
    @Size(max = 100, message = "Tên đường không vượt quá 100 ký tự!")
    String streetName;

    @NotBlank(message = "Phường / Xã không được để trống!")
    @Size(max = 30, message = "Phường / Xã không vượt quá 30 ký tự!")
    String ward;

    @NotBlank(message = "Tỉnh / Thành phố không được để trống!")
    @Size(max = 25, message = "Tỉnh / Thành không vượt quá 30 ký tự!")
    String province;

    String description;
}
