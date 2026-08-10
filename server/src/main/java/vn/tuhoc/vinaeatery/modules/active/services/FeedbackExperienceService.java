package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackExperienceEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.FeedbackExperienceMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackExperienceCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackExperienceRepository;

@Service
@RequiredArgsConstructor
public class FeedbackExperienceService {
    private final FeedbackExperienceRepository feedbackExperienceRepository;
    private final FeedbackExperienceMapper feedbackExperienceMapper;

    private List<FeedbackExperienceEntity> getAll() {
        return this.feedbackExperienceRepository.findAll();
    }

    @Cacheable(value = "feedback_experience__crud", unless = "#result == null")
    public List<FeedbackExperienceCrudResponseDTO> handleGetCrud() {
        return this.getAll().stream()
                .map(this.feedbackExperienceMapper::entityToCrudResponse)
                .sorted(Comparator.comparing(FeedbackExperienceCrudResponseDTO::getIndex))
                .collect(Collectors.toList());
    }
}
