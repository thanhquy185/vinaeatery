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
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderSheetStatusConverter;

@Entity
@Table(name = "order_sheets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderSheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống !")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo phiếu không được để trống !")
    private LocalDateTime createAt;
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime serviceAt;
    private Integer employeeId;
    @NotNull(message = "Mã bàn ăn không được để trống !")
    private Integer tableId;
    private Long totalPrice;
    @Column(columnDefinition = "TEXT")
    private String note;
    @Column(columnDefinition = "TEXT")
    private String message;
    @Column(columnDefinition = "TINYINT(3)")
    @Convert(converter = OrderSheetStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private OrderSheetStatusEnum status;
}
