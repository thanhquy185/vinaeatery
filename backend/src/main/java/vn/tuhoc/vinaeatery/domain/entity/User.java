package vn.tuhoc.vinaeatery.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonGenderConverter;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.UserMethodConverter;
import vn.tuhoc.vinaeatery.repository.converter.UserRoleConverter;
import vn.tuhoc.vinaeatery.repository.converter.UserIsUsingConverter;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo không được để trống !")
    private String createAt;
    @Convert(converter = UserRoleConverter.class)
    @NotNull(message = "Quyền không được để trống")
    private UserRoleEnum role;
    @NotNull(message = "Tên tài khoản không được để trống")
    private String username;
    @NotNull(message = "Mật khẩu không được để trống")
    @JsonIgnore
    private String password;
    @Convert(converter = UserMethodConverter.class)
    @NotNull(message = "Phương thức tài khoản không được để trống !")
    private UserMethodEnum method;
    @Column(columnDefinition = "MEDIUMTEXT")
    @JsonIgnore
    private String refreshToken;
    @Convert(converter = UserIsUsingConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private UserIsUsingEnum isUsing;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    private String updateAt;
}
