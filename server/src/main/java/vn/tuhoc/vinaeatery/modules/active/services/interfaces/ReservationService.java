package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.ReservationCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface ReservationService {
    ReservationDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<ReservationSummaryResponseDTO> handleGetSummary(ReservationCriteria reservationCriteria);

    PageResponseDTO<ReservationCustomerResponseDTO> handleGetAllByCustomerId(ReservationCriteria reservationCriteria);

    List<ReservationCrudResponseDTO> handleGetCrud();

    List<ReservationCrudResponseDTO> handleGetCrud(Integer restaurantId);

    ReservationDetailResponseDTO handleCreate(ReservationCreateRequestDTO reservationCreateRequestDTO);

    ReservationDetailResponseDTO handleCustomerCreate(
            ReservationCustomerCreateRequestDTO reservationCustomerCreateRequestDTO);

    ReservationDetailResponseDTO handleUpdateStatus(
            Integer id,
            ReservationUpdateStatusRequestDTO reservationUpdateStatusRequestDTO);
}
