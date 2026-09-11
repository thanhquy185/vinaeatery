package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMethodMapperHelper;
import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                PaymentMethodMapperHelper.class,
})
public interface BillMapper2 {
        BillInfoResponseDTO entityToInfoResponse(BillEntity billEntity);
}
