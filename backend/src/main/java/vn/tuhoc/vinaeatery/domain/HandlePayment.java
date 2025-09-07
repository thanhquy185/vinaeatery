package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
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
    private Integer id;
    private Long useTableId;
    private Integer employeeId;
    private Integer payMethodId;
    private Long payTotalPrice;
    @Convert(converter = HandlePaymentStatusConverter.class)
    @NotNull(message = "Trạng thái thanh toán không được để trống !")
    private HandlePaymentStatusEnum status;
}
