package vn.tuhoc.vinaeatery.domain.entity;

import java.time.LocalDateTime;

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
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Order {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo đơn không được để trống!")
    private LocalDateTime createAt;
    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;
    @NotNull(message = "Mã khách hàng không được để trống!")
    private Integer customerId;
    @NotNull(message = "Họ và tên khách hàng không được để trống!")
    private String customerFullname;
    @Column(columnDefinition = "VARCHAR(11)")
    @NotNull(message = "Số điện thoại khách hàng không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String customerPhone;
    @NotNull(message = "Email khách hàng không được để trống!")
    @Email(message = "Định dạng email không hợp lệ!", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    private String customerEmail;
    private Long totalPrice;
    @Column(columnDefinition = "TINYINT(2)")
    @Convert(converter = OrderStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private OrderStatusEnum status;
    @NotNull(message = "Mã giao dịch không được để trống!")
    private String payId;
    @NotNull(message = "Mã phương thức thanh toán không được để trống!")
    private Integer payMethodId;
    @NotNull(message = "Thời gian thanh toán không được để trống!")
    private LocalDateTime payTime;
    @NotNull(message = "Số tiền thanh toán không được để trống!")
    private Long payTotalPrice;
    @Convert(converter = PayStatusConverter.class)
    @NotNull(message = "Thanh toán không được để trống!")
    private PayStatusEnum payStatus;
}
