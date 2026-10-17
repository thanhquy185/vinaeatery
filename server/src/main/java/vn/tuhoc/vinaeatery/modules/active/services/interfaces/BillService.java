package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.BillCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface BillService {
    BillDetailResponseDTO handleGetDetailById(Integer id);

    BillCustomerDetailResponseDTO handleGetCustomerDetailById(Integer id, Integer customerId);

    PageResponseDTO<BillSummaryResponseDTO> handleGetSummary(BillCriteria billCriteria);

    PageResponseDTO<BillCustomerResponseDTO> handleGetAllByCustomerId(
            BillCriteria billCriteria,
            Integer customerId);

    BillDetailResponseDTO handleCreate(BillCreateRequestDTO billCreateRequestDTO);

    BillDetailResponseDTO handleUpdateStatus(
            Integer id,
            BillUpdateStatusRequestDTO billUpdateStatusRequestDTO);

}
