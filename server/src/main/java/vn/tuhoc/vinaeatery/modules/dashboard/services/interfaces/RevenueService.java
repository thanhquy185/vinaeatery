package vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces;

import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.RevenueRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueResponseDTO;

public interface RevenueService {
    RevenueResponseDTO handleDashboard(RevenueRequestDTO revenueRequestDTO);
}
