package vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces;

import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.FeedbackRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackResponseDTO;

public interface DFeedbackService {
    FeedbackResponseDTO handleDashboard(FeedbackRequestDTO feedbackRequestDTO);
}
