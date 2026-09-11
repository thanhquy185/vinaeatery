package vn.tuhoc.vinaeatery.modules.payment.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMethodMapper;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMethodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.payment.repositories.PaymentMethodRepository;
import vn.tuhoc.vinaeatery.modules.payment.services.interfaces.PaymentMethodService;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMethodServiceImplement implements PaymentMethodService {
    final PaymentMethodRepository paymentMethodRepository;
    final PaymentMethodMapper paymentMethodMapper;

    private PaymentMethodEntity getOneById(Integer id) {
        return this.paymentMethodRepository.findOneById(id)
                .orElseThrow(() -> new PaymentMethodNotFoundByIdException(id));
    }

    private List<PaymentMethodEntity> getAll() {
        return this.paymentMethodRepository.findAll();
    }

    @Override
    @Cacheable(value = "payment_methods__detail", key = "#id", unless = "#result == null")
    public PaymentMethodDetailResponseDTO handleGetDetailById(Integer id) {
        return this.paymentMethodMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "payment_methods__summary", unless = "#result == null")
    public List<PaymentMethodCrudResponseDTO> handleGetCrud() {
        return this.getAll().stream()
                .map(this.paymentMethodMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }
}
