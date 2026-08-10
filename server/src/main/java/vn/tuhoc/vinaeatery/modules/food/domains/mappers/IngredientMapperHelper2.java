package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;

@Component
@RequiredArgsConstructor
public class IngredientMapperHelper2 {
    private final IngredientMapper ingredientMapper;

    public IngredientInfoResponseDTO mapToInfoResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToInfoResponse(ingredientEntity);
    }
}