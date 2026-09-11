package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface FeedbackMapper2 {
        FeedbackInfoResponseDTO entityToInfoResponse(FeedbackEntity feedbackEntity);
}
