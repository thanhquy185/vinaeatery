package vn.tuhoc.vinaeatery.modules.dashboard.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ExpenseRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces.ExpenseService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/dashboard-expense")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExpenseController {
    ExpenseService expenseService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('DASHBOARD_EXPENSE__READ')")
    public ResponseEntity<RestResponseDTO<ExpenseResponseDTO>> handleDashboard(
            @RequestBody @Valid ExpenseRequestDTO expenseRequestDTO) {
        ExpenseResponseDTO expenseResponseDTO = this.expenseService.handleDashboard(expenseRequestDTO);

        return RestResponseUtils.ok(
                "Truy vấn dữ liệu thống kê chi tiêu thành công!",
                expenseResponseDTO);
    }
}
