package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackScoreCrudResponseDTO;

public interface FeedbackScoreService {
    List<FeedbackScoreCrudResponseDTO> handleGetCrud();
}
