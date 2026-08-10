package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDDetailResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                IngredientMapperHelper.class
})
public interface InputTicketDetailMapper {
        InputTicketDDetailResponseDTO entityToDetailResponse(InputTicketDetailEntity inputTicketDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.inputTicketId", ignore = true)
        @Mapping(target = "inputTicket", ignore = true)
        @Mapping(target = "ingredient", source = "ingredientId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "inputPrice", source = "inputPrice")
        @Mapping(target = "ingredientNameSnapshot", source = "ingredientNameSnapshot")
        @Mapping(target = "ingredientInputPriceSnapshot", source = "ingredientInputPriceSnapshot")
        @Mapping(target = "totalInputPriceDetail", source = "totalInputPriceDetail")
        InputTicketDetailEntity createEntityFromRequest(
                        InputTicketDetailCreateRequestDTO inputTicketDetailCreateRequestDTO);
}
