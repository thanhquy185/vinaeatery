package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.FeedbackCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;

public interface FeedbackService {
    FeedbackDetailResponseDTO handleGetDetailById(Integer id);

    FeedbackDetailResponseDTO handleCreate(FeedbackCreateRequestDTO feedbackCreateRequestDTO);
}
