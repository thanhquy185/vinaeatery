package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
})
public interface CategoryIngredientMapper {
        CategoryIngredientDetailResponseDTO entityToDetailResponse(CategoryIngredientEntity categoryIngredientEntity);

        CategoryIngredientSummaryResponseDTO entityToSummaryResponse(CategoryIngredientEntity categoryIngredientEntity);

        CategoryIngredientCrudResponseDTO entityToCrudResponse(CategoryIngredientEntity categoryIngredientEntity);

        CategoryIngredientInfoResponseDTO entityToInfoResponse(CategoryIngredientEntity categoryIngredientEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "categoryIngredientCreateRequestDTO.restaurantId")
        CategoryIngredientEntity createEntityFromRequest(
                        CategoryIngredientCreateRequestDTO categoryIngredientCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        CategoryIngredientUpdateRequestDTO categoryIngredientUpdateRequestDTO,
                        @MappingTarget CategoryIngredientEntity categoryIngredientEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "description", ignore = true)
        void deleteEntityFromRequest(
                        CategoryIngredientDeleteRequestDTO categoryIngredientDeleteRequestDTO,
                        @MappingTarget CategoryIngredientEntity categoryIngredientEntity);
}
