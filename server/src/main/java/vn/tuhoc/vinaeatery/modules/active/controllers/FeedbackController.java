package vn.tuhoc.vinaeatery.modules.active.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.FeedbackCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.FeedbackService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackController {
        final FeedbackService feedbackService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<FeedbackDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                FeedbackDetailResponseDTO feedbackDetail = this.feedbackService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn đánh giá theo mã đánh giá thành công!",
                                feedbackDetail);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<FeedbackDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid FeedbackCreateRequestDTO feedbackCreateRequestDTO) {
                FeedbackDetailResponseDTO feedbackCreated = this.feedbackService.handleCreate(feedbackCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm đánh giá thành công!",
                                feedbackCreated);
        }
}
