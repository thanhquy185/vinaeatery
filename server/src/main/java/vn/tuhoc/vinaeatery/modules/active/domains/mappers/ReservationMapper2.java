package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface ReservationMapper2 {
        @Mapping(target = "customerId", source = "customer.id")
        ReservationInfoResponseDTO entityToInfoResponse(ReservationEntity reservationEntity);
}
