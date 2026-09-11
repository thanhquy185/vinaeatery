package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.BillCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface BillService {
    BillDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<BillSummaryResponseDTO> handleGetSummary(BillCriteria billCriteria);

    List<BillCustomerResponseDTO> handleGetAllByCustomerId(Integer customerId);

    BillDetailResponseDTO handleCreate(BillCreateRequestDTO billCreateRequestDTO);

    BillDetailResponseDTO handleUpdateStatus(
            Integer id,
            BillUpdateStatusRequestDTO billUpdateStatusRequestDTO);

}
