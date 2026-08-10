package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.CustomerMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.FeedbackCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.FeedbackInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                CustomerMapperHelper.class,
})
public interface FeedbackMapper {
        FeedbackDetailResponseDTO entityToDetailResponse(FeedbackEntity feedbackEntity);

        FeedbackInfoResponseDTO entityToInfoResponse(FeedbackEntity feedbackEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "customer", source = "customerId")
        FeedbackEntity createEntityFromRequest(FeedbackCreateRequestDTO feedbackCreateRequestDTO);
}
