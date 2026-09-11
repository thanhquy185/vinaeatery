package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                CategoryFoodMapperHelper.class,
                RecipeMapperHelper.class
})
public interface FoodMapper {
        FoodDetailResponseDTO entityToDetailResponse(FoodEntity foodEntity);

        FoodSummaryResponseDTO entityToSummaryResponse(FoodEntity foodEntity);

        FoodCrudResponseDTO entityToCrudResponse(FoodEntity foodEntity);

        FoodInfoResponseDTO entityToInfoResponse(FoodEntity foodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "image", source = "image")
        @Mapping(target = "restaurant", source = "foodCreateRequestDTO.restaurantId")
        @Mapping(target = "categoryFood", source = "foodCreateRequestDTO.categoryFoodId")
        @Mapping(target = "recipes", ignore = true)
        FoodEntity createEntityFromRequest(String image, FoodCreateRequestDTO foodCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "categoryFood", source = "foodUpdateRequestDTO.categoryFoodId")
        @Mapping(target = "image", source = "image")
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "recipes", ignore = true)
        void updateEntityFromRequest(
                        String image,
                        FoodUpdateRequestDTO foodUpdateRequestDTO,
                        @MappingTarget FoodEntity foodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "categoryFood", ignore = true)
        @Mapping(target = "image", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "unit", ignore = true)
        @Mapping(target = "price", ignore = true)
        @Mapping(target = "description", ignore = true)
        @Mapping(target = "recipes", ignore = true)
        void deleteEntityFromRequest(
                        FoodDeleteRequestDTO foodDeleteRequestDTO,
                        @MappingTarget FoodEntity foodEntity);
}
