package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.IngredientNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.IngredientRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IngredientMapperHelper {
    final IngredientRepository ingredientRepository;
    final IngredientMapper ingredientMapper;

    public IngredientEntity mapToEntity(Integer id) {
        return this.ingredientRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new IngredientNotFoundByIdException(id));
    }

    public IngredientDetailResponseDTO mapToDetailResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToDetailResponse(ingredientEntity);
    }

    public IngredientSummaryResponseDTO mapToSummaryResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToSummaryResponse(ingredientEntity);
    }

    public IngredientCrudResponseDTO mapToCrudResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToCrudResponse(ingredientEntity);
    }

    public IngredientInfoResponseDTO mapToInfoResponse(IngredientEntity ingredientEntity) {
        return this.ingredientMapper.entityToInfoResponse(ingredientEntity);
    }
}