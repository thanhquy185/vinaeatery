package vn.tuhoc.vinaeatery.modules.active.services;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.FeedbackMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.FeedbackCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.FeedbackNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackRepository;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.FeedbackService;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackServiceImplement implements FeedbackService {
    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;

    private FeedbackEntity getOneById(Integer id) {
        return this.feedbackRepository.findOneById(id)
                .orElseThrow(() -> new FeedbackNotFoundByIdException(id));
    }

    public FeedbackDetailResponseDTO handleGetDetailById(Integer id) {
        return this.feedbackMapper.entityToDetailResponse(this.getOneById(id));
    }

    public FeedbackDetailResponseDTO handleCreate(FeedbackCreateRequestDTO feedbackCreateRequestDTO) {
        FeedbackEntity feedbackEntity = this.feedbackMapper.createEntityFromRequest(feedbackCreateRequestDTO);

        return this.feedbackMapper.entityToDetailResponse(this.feedbackRepository.save(feedbackEntity));
    }
}
