package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonGenderConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantUpdateDTO {
    @NotNull(message = "Mã chủ nhà hàng không được để trống!")
    private Integer managerId;
    @NotNull(message = "Tên nhà hàng không được để trống!")
    private String name;
    @NotNull(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String phone;
    @NotNull(message = "Email không được để trống!")
    @Email(message = "Định dạng email không hợp lệ!", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    @NotNull(message = "Địa chỉ không được để trống!")
    private String address;
    private String description;
    @NotNull(message = "Đánh giá không được để trống!")
    private Float rating;
    private String updateAt;
}
