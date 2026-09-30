package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
})
public interface CategoryFoodMapper {
        CategoryFoodDetailResponseDTO entityToDetailResponse(CategoryFoodEntity categoryFoodEntity);

        CategoryFoodSummaryResponseDTO entityToSummaryResponse(CategoryFoodEntity categoryFoodEntity);

        CategoryFoodCrudResponseDTO entityToCrudResponse(CategoryFoodEntity categoryFoodEntity);

        CategoryFoodInfoResponseDTO entityToInfoResponse(CategoryFoodEntity categoryFoodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "restaurant", source = "categoryFoodCreateRequestDTO.restaurantId")
        @Mapping(target = "foods", ignore = true)
        CategoryFoodEntity createEntityFromRequest(
                        String imageUrl,
                        String imagePublicId,
                        CategoryFoodCreateRequestDTO categoryFoodCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "foods", ignore = true)
        void updateEntityFromRequest(
                        String imageUrl,
                        String imagePublicId,
                        CategoryFoodUpdateRequestDTO categoryFoodUpdateRequestDTO,
                        @MappingTarget CategoryFoodEntity categoryFoodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "imageUrl", ignore = true)
        @Mapping(target = "imagePublicId", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "description", ignore = true)
        @Mapping(target = "foods", ignore = true)
        void deleteEntityFromRequest(
                        CategoryFoodDeleteRequestDTO categoryFoodDeleteRequestDTO,
                        @MappingTarget CategoryFoodEntity categoryFoodEntity);
}
