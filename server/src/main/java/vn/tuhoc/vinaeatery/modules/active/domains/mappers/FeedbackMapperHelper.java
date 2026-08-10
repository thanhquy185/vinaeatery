package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.FeedbackNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackRepository;

@Component
@RequiredArgsConstructor
public class FeedbackMapperHelper {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;

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