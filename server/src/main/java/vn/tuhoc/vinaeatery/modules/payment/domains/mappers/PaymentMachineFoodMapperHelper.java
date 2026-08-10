package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineFoodDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class PaymentMachineFoodMapperHelper {
    private final PaymentMachineFoodMapper paymentMachineFoodMapper;

    public PaymentMachineFoodDetailResponseDTO mapToDetailResponse(PaymentMachineFoodEntity paymentMachineFoodEntity) {
        return this.paymentMachineFoodMapper.entityToDetailResponse(paymentMachineFoodEntity);
    }
}