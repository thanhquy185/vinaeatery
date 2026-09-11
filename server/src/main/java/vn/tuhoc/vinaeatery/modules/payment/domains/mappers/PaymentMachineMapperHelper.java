package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.payment.repositories.PaymentMachineRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineMapperHelper {
    final PaymentMachineRepository paymentMachineRepository;
    final PaymentMachineMapper paymentMachineMapper;

    public PaymentMachineEntity mapToEntity(Integer id) {
        return this.paymentMachineRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new PaymentMachineNotFoundByIdException(id));
    }

    public PaymentMachineDetailResponseDTO mapToDetailResponse(PaymentMachineEntity paymentMachineEntity) {
        return this.paymentMachineMapper.entityToDetailResponse(paymentMachineEntity);
    }

    public PaymentMachineInfoResponseDTO mapToInfoResponse(PaymentMachineEntity paymentMachineEntity) {
        return this.paymentMachineMapper.entityToInfoResponse(paymentMachineEntity);
    }
}