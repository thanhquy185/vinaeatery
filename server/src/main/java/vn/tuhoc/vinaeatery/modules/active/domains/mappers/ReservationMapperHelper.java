package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.ReservationNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.ReservationRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationMapperHelper {
    final ReservationRepository reservationRepository;
    final ReservationMapper reservationMapper;

    public ReservationEntity mapToEntity(Integer id) {
        return this.reservationRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new ReservationNotFoundByIdException(id));
    }

    public ReservationDetailResponseDTO mapToDetailResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper.entityToDetailResponse(reservationEntity);
    }

    public ReservationSummaryResponseDTO mapToSummaryResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper.entityToSummaryResponse(reservationEntity);
    }

    public ReservationCustomerResponseDTO mapToCustomerResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper.entityToCustomerResponse(reservationEntity);
    }

    public ReservationCrudResponseDTO mapToCrudResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper.entityToCrudResponse(reservationEntity);
    }

    public ReservationInfoResponseDTO mapToInfoResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper.entityToInfoResponse(reservationEntity);
    }
}
