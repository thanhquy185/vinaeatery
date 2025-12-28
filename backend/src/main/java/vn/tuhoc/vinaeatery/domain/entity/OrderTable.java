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
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderStatusConverter;

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
    @NotNull(message = "Mã nhà hàng không được để trống !")
    private Integer restaurantId;
    private Integer employeeId;
    @NotNull(message = "Mã khách hàng không được để trống !")
    private Integer customerId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian đặt bàn không được để trống !")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String createAt;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian dự kiến không được để trống !")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String arriveAt;
    @NotNull(message = "Họ và tên khách hàng không được để trống !")
    private String customerFullname;
    @Column(columnDefinition = "VARCHAR(11)")
    @NotNull(message = "Số điện thoại khách hàng không được để trống !")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số !")
    private String customerPhone;
    @NotNull(message = "Email khách hàng không được để trống !")
    @Email(message = "Định dạng email không hợp lệ !", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String customerEmail;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String customerNote;
    @NotNull(message = "Số lượng khách không được để trống !")
    private Integer guests;
    @Convert(converter = OrderStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private OrderStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String updateAt;
}
