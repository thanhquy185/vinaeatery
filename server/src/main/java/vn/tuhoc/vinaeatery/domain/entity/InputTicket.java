package vn.tuhoc.vinaeatery.domain.entity;

import java.time.LocalDateTime;

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
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@Entity
@Table(name = "input_tickets")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InputTicket {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo phiếu không được để trống!")
    private LocalDateTime createAt;
    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;
    @NotNull(message = "Mã nhà cung cấp không được để trống!")
    private Integer supplierId;
    private Long totalPrice;
    @Convert(converter = PayStatusConverter.class)
    @NotNull(message = "Thanh toán không được để trống!")
    private PayStatusEnum payStatus;
    @Column(columnDefinition = "TINYINT(3)")
    @Convert(converter = InputTicketStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private InputTicketStatusEnum status;
}
