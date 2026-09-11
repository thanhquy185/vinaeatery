package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface OrderSheetService {
    OrderSheetDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<OrderSheetSummaryResponseDTO> handleGetSummary(OrderSheetCriteria orderSheetCriteria);

    OrderSheetDetailResponseDTO handleCreate(OrderSheetCreateRequestDTO orderSheetCreateRequestDTO);

    OrderSheetDetailResponseDTO handleUpdateStatus(
            Integer id,
            OrderSheetUpdateStatusRequestDTO orderSheetUpdateStatusRequestDTO);

    
}
