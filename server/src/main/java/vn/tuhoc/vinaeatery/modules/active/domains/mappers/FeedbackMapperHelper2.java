package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackInfoResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackMapperHelper2 {
    final FeedbackMapper2 feedbackMapper2;

    public FeedbackInfoResponseDTO mapToInfoResponse(FeedbackEntity feedbackEntity) {
        return this.feedbackMapper2.entityToInfoResponse(feedbackEntity);
    }
}