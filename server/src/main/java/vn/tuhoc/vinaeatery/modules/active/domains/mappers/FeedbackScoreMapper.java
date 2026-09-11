package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackScoreEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackScoreCrudResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface FeedbackScoreMapper {
    FeedbackScoreCrudResponseDTO entityToCrudResponse(FeedbackScoreEntity feedbackScoreEntity);
}
