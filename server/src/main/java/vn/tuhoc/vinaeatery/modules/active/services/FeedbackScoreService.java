package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackScoreEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.FeedbackScoreMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackScoreCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackScoreRepository;

@Service
@RequiredArgsConstructor
public class FeedbackScoreService {
    private final FeedbackScoreRepository feedbackScoreRepository;
    private final FeedbackScoreMapper feedbackScoreMapper;

    private List<FeedbackScoreEntity> getAll() {
        return this.feedbackScoreRepository.findAll();
    }

    @Cacheable(value = "feedback_score__crud", unless = "#result == null")
    public List<FeedbackScoreCrudResponseDTO> handleGetCrud() {
        return this.getAll().stream()
                .map(this.feedbackScoreMapper::entityToCrudResponse)
                .sorted(Comparator.comparing(FeedbackScoreCrudResponseDTO::getIndex))
                .collect(Collectors.toList());
    }
}
