package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                CategoryIngredientMapperHelper.class
})
public interface IngredientMapper {
        IngredientDetailResponseDTO entityToDetailResponse(IngredientEntity ingredientEntity);

        IngredientSummaryResponseDTO entityToSummaryResponse(IngredientEntity ingredientEntity);

        IngredientCrudResponseDTO entityToCrudResponse(IngredientEntity ingredientEntity);

        IngredientInfoResponseDTO entityToInfoResponse(IngredientEntity ingredientEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "categoryIngredient", source = "categoryIngredientId")
        @Mapping(target = "inputTicketDetails", ignore = true)
        @Mapping(target = "recipes", ignore = true)
        IngredientEntity createEntityFromRequest(IngredientCreateRequestDTO ingredientCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "categoryIngredient", source = "categoryIngredientId")
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "inputTicketDetails", ignore = true)
        @Mapping(target = "recipes", ignore = true)
        void updateEntityFromRequest(
                        IngredientUpdateRequestDTO ingredientUpdateRequestDTO,
                        @MappingTarget IngredientEntity ingredientEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "categoryIngredient", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "unit", ignore = true)
        @Mapping(target = "capacity", ignore = true)
        @Mapping(target = "dateCreate", ignore = true)
        @Mapping(target = "dateRemove", ignore = true)
        @Mapping(target = "inputPrice", ignore = true)
        @Mapping(target = "inventory", ignore = true)
        @Mapping(target = "note", ignore = true)
        @Mapping(target = "inputTicketDetails", ignore = true)
        @Mapping(target = "recipes", ignore = true)
        void deleteEntityFromRequest(
                        IngredientDeleteRequestDTO ingredientDeleteRequestDTO,
                        @MappingTarget IngredientEntity ingredientEntity);
}
