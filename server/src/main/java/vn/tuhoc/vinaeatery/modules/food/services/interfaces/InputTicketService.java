package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdatePaymentStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface InputTicketService {
    InputTicketDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<InputTicketSummaryResponseDTO> handleGetSummary(
            InputTicketCriteria inputTicketCriteria);

    InputTicketDetailResponseDTO handleCreate(InputTicketCreateRequestDTO inputTicketCreateRequestDTO);

    InputTicketDetailResponseDTO handleUpdatePaymentStatus(
            Integer id,
            InputTicketUpdatePaymentStatusRequestDTO inputTicketUpdatePaymentStatusRequestDTO);

    InputTicketDetailResponseDTO handleUpdateStatus(
            Integer id,
            InputTicketUpdateStatusRequestDTO inputTicketUpdateStatusRequestDTO);
}
