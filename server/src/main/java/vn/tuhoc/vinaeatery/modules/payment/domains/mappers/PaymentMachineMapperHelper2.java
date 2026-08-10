package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;

@Component
@RequiredArgsConstructor
public class PaymentMachineMapperHelper2 {
    private final PaymentMachineMapper2 paymentMachineMapper2;

    public PaymentMachineInfoResponseDTO mapToInfoResponse(PaymentMachineEntity paymentMachineEntity) {
        return this.paymentMachineMapper2.entityToInfoResponse(paymentMachineEntity);
    }
}