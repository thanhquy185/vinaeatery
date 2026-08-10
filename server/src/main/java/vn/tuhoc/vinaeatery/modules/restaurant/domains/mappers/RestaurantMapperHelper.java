package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantManagerResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;

@Component
@RequiredArgsConstructor
public class RestaurantMapperHelper {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public RestaurantEntity mapToEntity(Integer id) {
        return this.restaurantRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new RestaurantNotFoundByIdException(id));
    }

    public RestaurantDetailResponseDTO mapToDetailResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToDetailResponse(restaurantEntity);
    }

    public RestaurantSummaryResponseDTO mapToSummaryResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToSummaryResponse(restaurantEntity);
    }

    public RestaurantPublicResponseDTO mapToPublicResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToPublicResponse(restaurantEntity);
    }

    public RestaurantPublicDetailResponseDTO mapToPublicDetailResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToPublicDetailResponse(restaurantEntity);
    }

    public RestaurantManagerResponseDTO mapToManagerResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToManagerResponse(restaurantEntity);
    }

    public RestaurantInfoResponseDTO mapToInfoResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToInfoResponse(restaurantEntity);
    }

    public RestaurantSubInfoResponseDTO mapToSubInfoResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToSubInfoResponse(restaurantEntity);
    }

    public RestaurantCrudResponseDTO mapToCrudResponse(RestaurantEntity restaurantEntity) {
        return this.restaurantMapper.entityToCrudResponse(restaurantEntity);
    }
}