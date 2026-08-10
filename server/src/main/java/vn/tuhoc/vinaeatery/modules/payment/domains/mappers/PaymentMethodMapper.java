package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaymentMethodMapper {
    PaymentMethodDetailResponseDTO entityToDetailResponse(PaymentMethodEntity payMethodEntity);

    PaymentMethodInfoResponseDTO entityToInfoResponse(PaymentMethodEntity payMethodEntity);

    PaymentMethodCrudResponseDTO entityToCrudResponse(PaymentMethodEntity payMethodEntity);
}
