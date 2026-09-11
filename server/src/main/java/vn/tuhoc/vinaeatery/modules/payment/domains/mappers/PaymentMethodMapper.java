package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface PaymentMethodMapper {
    PaymentMethodDetailResponseDTO entityToDetailResponse(PaymentMethodEntity payMethodEntity);

    PaymentMethodInfoResponseDTO entityToInfoResponse(PaymentMethodEntity payMethodEntity);

    PaymentMethodCrudResponseDTO entityToCrudResponse(PaymentMethodEntity payMethodEntity);
}
