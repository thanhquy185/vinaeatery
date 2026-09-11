package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IngredientMapperHelper2 {
    final IngredientMapper ingredientMapper;

    public IngredientInfoResponseDTO mapToInfoResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToInfoResponse(ingredientEntity);
    }
}