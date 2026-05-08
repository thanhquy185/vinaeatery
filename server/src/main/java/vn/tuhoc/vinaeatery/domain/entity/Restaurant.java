package vn.tuhoc.vinaeatery.domain.entity;

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
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "restaurants")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Restaurant {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã chủ nhà hàng không được để trống!")
    private Integer managerId;
    // @Column(columnDefinition = "DATETIME")
    // @NotNull(message = "Thời gian tạo không được để trống!")
    private String createAt;
    @NotNull(message = "Tên nhà hàng không được để trống")
    private String name;
    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
    @NotNull(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String phone;
    @Column(unique = true, nullable = false)
    @NotNull(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ!", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    @Column(columnDefinition = "TEXT")
    @NotNull(message = "Địa chỉ không được để trống")
    private String address;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @NotNull(message = "Đánh giá không được để trống")
    private Float rating;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
}
