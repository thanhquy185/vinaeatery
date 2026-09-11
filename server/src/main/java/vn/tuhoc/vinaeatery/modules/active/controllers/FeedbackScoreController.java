package vn.tuhoc.vinaeatery.modules.active.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackScoreCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.FeedbackScoreService;

@RestController
@RequestMapping("/api/v1/feedback-scores")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackScoreController {
        final FeedbackScoreService feedbackScoreService;

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<FeedbackScoreCrudResponseDTO>>> handleGetCrud() {
                List<FeedbackScoreCrudResponseDTO> feedbackScoreCrud = this.feedbackScoreService
                                .handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách đánh giá điểm để xử lý thông tin thành công!",
                                feedbackScoreCrud);
        }
}
