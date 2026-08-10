package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.ReservationRepository;

@Component
@RequiredArgsConstructor
public class ReservationMapperHelper2 {
    private final ReservationRepository reservationRepository;
    private final ReservationMapper2 reservationMapper2;

    public ReservationEntity mapToEntity(Integer id) {
        return this.reservationRepository.findOneByIdToCrud(id).orElse(null);
    }

    public ReservationInfoResponseDTO mapToInfoResponse(ReservationEntity reservationEntity) {
        return this.reservationMapper2.entityToInfoResponse(reservationEntity);
    }
}
