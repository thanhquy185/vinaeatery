package vn.tuhoc.vinaeatery.modules.dashboard.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.FeedbackRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.DFeedbackService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/dashboard-feedback")
@RequiredArgsConstructor
public class DFeedbackController {
    private final DFeedbackService feedbackService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('DASHBOARD_FEEDBACK__READ')")
    public ResponseEntity<RestResponseDTO<FeedbackResponseDTO>> handleDashboard(
            @RequestBody @Valid FeedbackRequestDTO feedbackRequestDTO) {
        FeedbackResponseDTO feedbackResponseDTO = this.feedbackService.handleDashboard(feedbackRequestDTO);

        return RestResponseUtils.ok(
                "Truy vấn dữ liệu thống kê đánh giá thành công!",
                feedbackResponseDTO);
    }
}
