package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.RecipeDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecipeMapperHelper {
    final RecipeMapper recipeMapper;

    public RecipeDetailResponseDTO mapToDetailResponse(RecipeEntity recipeEntity) {
        return this.recipeMapper.entityToDetailResponse(recipeEntity);
    }
}