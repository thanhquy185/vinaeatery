package vn.tuhoc.vinaeatery.domain;

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
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "order_tables")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Nhân viên xác nhận không được để trống !")
    private Integer employeeId;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @NotNull(message = "Thời gian đặt bàn không được để trống !")
    private LocalDateTime timeOrder;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeArrive;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String note;
    @NotNull(message = "Họ và tên không được để trống !")
    private String fullname;
    @Column(columnDefinition = "VARCHAR(11)")
    @NotNull(message = "Số điện thoại không được để trống !")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số !")
    private String phone;
    // @NotNull(message = "Email không được để trống !")
    @Email(message = "Định dạng email không hợp lệ !", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String email;
    @Column(columnDefinition = "TEXT")
    // @NotNull(message = "Địa chỉ không được để trống !")
    private String address;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
}
