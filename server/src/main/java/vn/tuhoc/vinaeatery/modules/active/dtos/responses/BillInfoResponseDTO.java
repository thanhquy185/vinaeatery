package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillInfoResponseDTO {
    private Integer id;

    private String createAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Long totalPrice;

    @Convert(converter = BillStatusConverter.class)
    private BillStatusEnum status;

    private String paymentId;

    private PaymentMethodInfoResponseDTO paymentMethod;

    private String paymentAt;

    private Long paymentTotalPrice;

    @Convert(converter = BillPaymentStatusConverter.class)
    private BillPaymentStatusEnum paymentStatus;
}
