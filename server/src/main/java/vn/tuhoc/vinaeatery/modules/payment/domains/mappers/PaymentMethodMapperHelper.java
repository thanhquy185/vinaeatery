package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.repositories.PaymentMethodRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMethodMapperHelper {
    final PaymentMethodRepository paymentMethodRepository;
    final PaymentMethodMapper paymentMethodMapper;

    public PaymentMethodEntity mapToEntity(Integer id) {
        return this.paymentMethodRepository.findOneByIdToCrud(id).orElse(null);
    }

    public PaymentMethodDetailResponseDTO mapToDetailResponse(PaymentMethodEntity paymentMethodEntity) {
        return this.paymentMethodMapper.entityToDetailResponse(paymentMethodEntity);
    }

    public PaymentMethodInfoResponseDTO mapToInfoResponse(PaymentMethodEntity paymentMethodEntity) {
        return this.paymentMethodMapper.entityToInfoResponse(paymentMethodEntity);
    }

    public PaymentMethodCrudResponseDTO mapToCrudResponse(PaymentMethodEntity paymentMethodEntity) {
        return this.paymentMethodMapper.entityToCrudResponse(paymentMethodEntity);
    }
}