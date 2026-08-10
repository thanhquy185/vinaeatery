package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantImageDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class RestaurantImageMapperHelper {
    private final RestaurantImageMapper restaurantImageMapper;

    public RestaurantImageDetailResponseDTO mapToDetailResponse(RestaurantImageEntity restaurantImageEntity) {
        return this.restaurantImageMapper.entityToDetailResponse(restaurantImageEntity);
    }

}