package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantImageCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantImageUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantImageDetailResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class
})
public interface RestaurantImageMapper {
        @Mapping(target = "image", source = "id.image")
        RestaurantImageDetailResponseDTO entityToDetailResponse(RestaurantImageEntity restaurantImageEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "id.image", source = "image")
        RestaurantImageEntity createEntityFromRequest(
                        RestaurantImageCreateRequestDTO restaurantImageCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "id.image", source = "image")
        RestaurantImageEntity createEntityFromRequest(
                        RestaurantImageUpdateRequestDTO restaurantImageUpdateRequestDTO);
}
