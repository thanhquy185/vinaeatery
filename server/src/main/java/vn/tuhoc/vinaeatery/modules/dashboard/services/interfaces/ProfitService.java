package vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces;

import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ProfitRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitResponseDTO;

public interface ProfitService {
    ProfitResponseDTO handleDashboard(ProfitRequestDTO profitRequestDTO);
}
