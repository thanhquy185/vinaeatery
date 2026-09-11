package vn.tuhoc.vinaeatery.modules.employee.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionSummaryResponseDTO;

public interface FunctionService {
    FunctionDetailResponseDTO handleGetDetailById(Integer id);

    List<FunctionSummaryResponseDTO> handleGetSummary();
}
