package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface UseFoodService {
    UseFoodDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<UseFoodSummaryResponseDTO> handleGetSummary(UseFoodCriteria useFoodCriteria);

    UseFoodDetailResponseDTO handleCreate(UseFoodCreateRequestDTO useFoodCreateRequestDTO);

    UseFoodDetailResponseDTO handleCreateByFoodCreated(Integer restaurantId, Integer foodId, Integer employeeId);

    UseFoodDetailResponseDTO handleUpdateStatus(
            Integer id,
            UseFoodUpdateStatusRequestDTO useFoodUpdateStatusRequestDTO);
}
