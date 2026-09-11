package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillInfoResponseDTO {
    Integer id;

    String createAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Long totalPrice;

    @Convert(converter = BillStatusConverter.class)
    BillStatusEnum status;

    String paymentId;

    PaymentMethodInfoResponseDTO paymentMethod;

    String paymentAt;

    Long paymentTotalPrice;

    @Convert(converter = BillPaymentStatusConverter.class)
    BillPaymentStatusEnum paymentStatus;
}
