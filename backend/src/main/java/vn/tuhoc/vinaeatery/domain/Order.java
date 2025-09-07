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
import jakarta.validation.constraints.NotNull;
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
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo đơn không được để trống !")
    private LocalDateTime timeCreate;
    @NotNull(message = "Mã nhân viên không được để trống !")
    private Integer employeeId;
    @NotNull(message = "Mã khách hàng không được để trống !")
    private Integer customerId;
    private Long totalPrice;
    @Column(columnDefinition = "TINYINT(2)")
    @Convert(converter = OrderStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private OrderStatusEnum status;
    @NotNull(message = "Mã giao dịch không được để trống !")
    private String payId;
    @NotNull(message = "Mã phương thức thanh toán không được để trống !")
    private Integer payMethodId;
    @NotNull(message = "Thời gian thanh toán không được để trống !")
    private LocalDateTime payTime;
    @NotNull(message = "Số tiền thanh toán không được để trống !")
    private Long payTotalPrice;
    @Convert(converter = PayStatusConverter.class)
    @NotNull(message = "Thanh toán không được để trống !")
    private PayStatusEnum payStatus;
}
