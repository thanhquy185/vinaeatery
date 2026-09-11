package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.RecipeDetailResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                IngredientMapperHelper2.class
})
public interface RecipeMapper2 {
        RecipeDetailResponseDTO entityToDetailResponse(RecipeEntity recipeEntity);
}
