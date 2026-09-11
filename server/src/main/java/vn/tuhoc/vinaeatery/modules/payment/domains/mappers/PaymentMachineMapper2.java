package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                PaymentMethodMapperHelper.class,
                PaymentMachineFoodMapperHelper.class
})
public interface PaymentMachineMapper2 {
        PaymentMachineInfoResponseDTO entityToInfoResponse(PaymentMachineEntity payMethodEntity);
}
