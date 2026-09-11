package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantImageDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantImageMapperHelper {
    final RestaurantImageMapper restaurantImageMapper;

    public RestaurantImageDetailResponseDTO mapToDetailResponse(RestaurantImageEntity restaurantImageEntity) {
        return this.restaurantImageMapper.entityToDetailResponse(restaurantImageEntity);
    }

}