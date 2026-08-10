package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackScoreEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackScoreCrudResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeedbackScoreMapper {
    FeedbackScoreCrudResponseDTO entityToCrudResponse(FeedbackScoreEntity feedbackScoreEntity);
}
