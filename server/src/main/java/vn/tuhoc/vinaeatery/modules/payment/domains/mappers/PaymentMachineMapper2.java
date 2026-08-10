package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                PaymentMethodMapperHelper.class,
                PaymentMachineFoodMapperHelper.class
})
public interface PaymentMachineMapper2 {
        PaymentMachineInfoResponseDTO entityToInfoResponse(PaymentMachineEntity payMethodEntity);
}
