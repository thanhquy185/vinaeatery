package vn.tuhoc.vinaeatery.domain.entity;

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
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.HandlePaymentStatusConverter;

@Entity
@Table(name = "handle_payments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HandlePayment {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    // @NotNull(message = "Mã nhà hàng không được để trống!")
    // private Integer restaurantId;
    private Long useTableId;
    private Integer employeeId;
    private Integer payMethodId;
    private Boolean isEmployeeHandle;
    private Long payTotalPrice;
    @Convert(converter = HandlePaymentStatusConverter.class)
    @NotNull(message = "Trạng thái thanh toán không được để trống!")
    private HandlePaymentStatusEnum status;
}
