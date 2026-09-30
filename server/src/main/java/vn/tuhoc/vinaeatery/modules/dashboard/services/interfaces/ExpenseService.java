package vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces;

import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ExpenseRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseResponseDTO;

public interface ExpenseService {
    ExpenseResponseDTO handleDashboard(ExpenseRequestDTO expenseRequestDTO);
}
