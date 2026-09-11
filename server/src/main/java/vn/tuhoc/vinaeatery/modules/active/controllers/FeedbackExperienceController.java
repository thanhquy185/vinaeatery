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
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackExperienceCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.FeedbackExperienceService;

@RestController
@RequestMapping("/api/v1/feedback-experiences")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackExperienceController {
        final FeedbackExperienceService feedbackExperienceService;

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<FeedbackExperienceCrudResponseDTO>>> handleGetCrud() {
                List<FeedbackExperienceCrudResponseDTO> feedbackExperienceCrud = this.feedbackExperienceService
                                .handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách đánh giá trải nghiệm để xử lý thông tin thành công!",
                                feedbackExperienceCrud);
        }
}
