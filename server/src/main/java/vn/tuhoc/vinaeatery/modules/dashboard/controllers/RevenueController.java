package vn.tuhoc.vinaeatery.modules.dashboard.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.RevenueRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.RevenueService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/dashboard-revenue")
@RequiredArgsConstructor
public class RevenueController {
    private final RevenueService revenueService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('DASHBOARD_REVENUE__READ')")
    public ResponseEntity<RestResponseDTO<RevenueResponseDTO>> handleDashboard(
            @RequestBody @Valid RevenueRequestDTO revenueRequestDTO) {
        RevenueResponseDTO revenueResponseDTO = this.revenueService.handleDashboard(revenueRequestDTO);

        return RestResponseUtils.ok(
                "Truy vấn dữ liệu thống kê doanh thu thành công!",
                revenueResponseDTO);
    }
}
