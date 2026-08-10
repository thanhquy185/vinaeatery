package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.RecipeCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.RecipeUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.RecipeDetailResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                IngredientMapperHelper.class
})
public interface RecipeMapper {
        RecipeDetailResponseDTO entityToDetailResponse(RecipeEntity recipeEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.foodId", ignore = true)
        @Mapping(target = "food", ignore = true)
        @Mapping(target = "ingredient", source = "ingredientId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "note", source = "note")
        RecipeEntity createEntityFromRequest(RecipeCreateRequestDTO recipeCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.foodId", ignore = true)
        @Mapping(target = "food", ignore = true)
        @Mapping(target = "ingredient", source = "ingredientId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "note", source = "note")
        RecipeEntity updateEntityFromRequest(RecipeUpdateRequestDTO recipeUpdateRequestDTO);
}
