package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineFoodDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineFoodMapperHelper {
    final PaymentMachineFoodMapper paymentMachineFoodMapper;

    public PaymentMachineFoodDetailResponseDTO mapToDetailResponse(PaymentMachineFoodEntity paymentMachineFoodEntity) {
        return this.paymentMachineFoodMapper.entityToDetailResponse(paymentMachineFoodEntity);
    }
}