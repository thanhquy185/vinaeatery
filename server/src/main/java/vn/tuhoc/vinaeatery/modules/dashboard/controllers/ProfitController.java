package vn.tuhoc.vinaeatery.modules.dashboard.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ProfitRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.ProfitService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/dashboard-profit")
@RequiredArgsConstructor
public class ProfitController {
    private final ProfitService profitService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('DASHBOARD_PROFIT__READ')")
    public ResponseEntity<RestResponseDTO<ProfitResponseDTO>> handleDashboard(
            @RequestBody @Valid ProfitRequestDTO profitRequestDTO) {
        ProfitResponseDTO profitResponseDTO = this.profitService.handleDashboard(profitRequestDTO);

        return RestResponseUtils.ok(
                "Truy vấn dữ liệu thống kê lợi nhuận thành công!",
                profitResponseDTO);
    }
}
