package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface UseTableService {
        UseTableDetailResponseDTO handleGetDetailById(Long id);

        UseTableCustomerResponseDTO handleGetDetailByByRestaurantIdTableIdAndEndAtIsNull(
                        Integer restaurantId,
                        Integer tableId);

        PageResponseDTO<UseTableSummaryResponseDTO> handleGetSummary(UseTableCriteria useTableCriteria);

        UseTableDetailResponseDTO handleCreate(UseTableCreateRequestDTO useTableCreateRequestDTO);

        UseTableDetailResponseDTO handleCreateByTableCreated(Integer restaurantId, Integer tableId);

        UseTableDetailResponseDTO handleUpdateStatus(
                        Long id,
                        UseTableUpdateStatusRequestDTO useTableUpdateStatusRequestDTO);
}
