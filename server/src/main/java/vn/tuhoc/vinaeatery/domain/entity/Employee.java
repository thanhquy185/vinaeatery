package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonGenderConverter;
import vn.tuhoc.vinaeatery.repository.converter.EmployeeStatusConverter;

@Entity
@Table(name = "employees")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Employee {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo không được để trống!")
    private String createAt;
    private String image;
    @NotNull(message = "Họ và tên không được để trống!")
    private String fullname;
    @Column(columnDefinition = "DATE")
    private String birthday;
    @Convert(converter = CommonGenderConverter.class)
    private CommonGenderEnum gender;
    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
    @NotNull(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String phone;
    @Column(unique = true, nullable = false)
    @NotNull(message = "Email không được để trống!")
    @Email(message = "Định dạng email không hợp lệ!", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    @Column(columnDefinition = "TEXT")
    private String address;
    // @NotNull(message = "Mã tài khoản không được để trống!")
    @Column(nullable = false)
    private Integer userId;
    @Transient
    private Integer roleId;
    @Transient
    private String username;
    @Transient
    private String password;
    @NotNull(message = "Mã quyền hạn không được để trống!")
    private Integer permissionId;
    @Convert(converter = EmployeeStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private EmployeeStatusEnum status;
}
