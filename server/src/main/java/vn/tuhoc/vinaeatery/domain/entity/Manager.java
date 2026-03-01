package vn.tuhoc.vinaeatery.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonGenderConverter;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "managers")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Manager {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã tài khoản không được để trống!")
    private Integer userId;
    // @Column(columnDefinition = "DATETIME")
    // @NotNull(message = "Thời gian tạo không được để trống!")
    private String createAt;
    private String image;
    @NotNull(message = "Họ tên quản lý không được để trống!")
    private String fullname;
    @Column(columnDefinition = "DATE")
    private String birthday;
    @Convert(converter = CommonGenderConverter.class)
    private CommonGenderEnum gender;
    @Column(columnDefinition = "VARCHAR(11)")
    @NotNull(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String phone;
    @NotNull(message = "Email không được để trống!")
    @Email(message = "Định dạng email không hợp lệ!", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    @Column(columnDefinition = "TEXT")
    // @NotNull(message = "Địa chỉ không được để trống!")
    private String address;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    private String updateAt;
}
