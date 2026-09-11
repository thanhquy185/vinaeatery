package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.FeedbackNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackMapperHelper {
    final FeedbackRepository feedbackRepository;
    final FeedbackMapper feedbackMapper;

    public FeedbackEntity mapToEntity(Integer id) {
        return this.feedbackRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new FeedbackNotFoundByIdException(id));
    }

    public FeedbackDetailResponseDTO mapToDetailResponse(FeedbackEntity feedbackEntity) {
        return this.feedbackMapper.entityToDetailResponse(feedbackEntity);
    }

    public FeedbackInfoResponseDTO mapToInfoResponse(FeedbackEntity feedbackEntity) {
        return this.feedbackMapper.entityToInfoResponse(feedbackEntity);
    }
}