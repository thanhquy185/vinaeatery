package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageDDetailResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MessageDetailMapper {
        @Mapping(target = "sendAt", source = "id.sendAt")
        @Mapping(target = "isRestaurantSend", source = "id.isRestaurantSend")
        MessageDDetailResponseDTO entityToDetailResponse(MessageDetailEntity messageDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.messageId", ignore = true)
        @Mapping(target = "id.sendAt", source = "sendAt")
        @Mapping(target = "id.isRestaurantSend", source = "isRestaurantSend")
        @Mapping(target = "message", ignore = true)
        @Mapping(target = "content", source = "content")
        MessageDetailEntity createEntityFromRequest(
                        MessageDetailCreateRequestDTO messageDetailCreateRequestDTO);
}
