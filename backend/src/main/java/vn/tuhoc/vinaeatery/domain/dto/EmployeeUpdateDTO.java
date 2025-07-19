package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeUpdateDTO {
    // Properties
    private String image;
    @NotNull(message = "Họ và tên không được để trống !")
    private String fullname;
    private String birthday;
    private String gender;
    @NotNull(message = "Số điện thoại không được để trống !")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số !")
    private String phone;
    // @NotNull(message = "Email không được để trống !")
    @Email(message = "Định dạng email không hợp lệ !", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    private String address;
    private String dateBegin;
    private String dateEnd;
    @NotNull(message = "Chức vụ không được để trống !")
    private Integer roleId;
    private LocalDateTime timeUpdate;
}
