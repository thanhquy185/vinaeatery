package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                MessageDetailMapperHelper.class
})
public interface MessageMapper2 {
        MessageInfoResponseDTO entityToInfoResponse(MessageEntity messageEntity);
}
