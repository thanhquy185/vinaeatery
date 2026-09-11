package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackExperienceEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackExperienceCrudResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface FeedbackExperienceMapper {
    FeedbackExperienceCrudResponseDTO entityToCrudResponse(FeedbackExperienceEntity feedbackExperienceEntity);
}
