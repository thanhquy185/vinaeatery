package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.RecipeDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class RecipeMapperHelper {
    private final RecipeMapper recipeMapper;

    public RecipeDetailResponseDTO mapToDetailResponse(RecipeEntity recipeEntity) {
        return this.recipeMapper.entityToDetailResponse(recipeEntity);
    }
}