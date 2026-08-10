package vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Data
public class RestaurantCreateRequestDTO {
    @NotNull(message = "Mã chủ nhà hàng không được để trống!")
    private Integer managerId;

    @NotNull(message = "Thời gian mở cửa không được để trống!")
    private String openAt;

    @NotNull(message = "Thời gian đóng cửa không được để trống!")
    private String closeAt;

    @NotBlank(message = "Tên nhà hàng không được để trống")
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String phone;

    @NotBlank(message = "Email không được để trống")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    private String email;

    @NotNull(message = "Vĩ độ không được để trống!")
    private Double latitude;

    @NotNull(message = "Kinh độ không được để trống!")
    private Double longitude;

    @NotBlank(message = "Số nhà không được để trống!")
    @Size(max = 25, message = "Số nhà không vượt quá 30 ký tự!")
    private String houseNumber;

    @NotBlank(message = "Tên đường không được để trống!")
    @Size(max = 100, message = "Tên đường không vượt quá 100 ký tự!")
    private String streetName;

    @NotBlank(message = "Phường / Xã không được để trống!")
    @Size(max = 30, message = "Phường / Xã không vượt quá 30 ký tự!")
    private String ward;

    @NotBlank(message = "Tỉnh / Thành phố không được để trống!")
    @Size(max = 25, message = "Tỉnh / Thành không vượt quá 30 ký tự!")
    private String province;

    private String description;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
