package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                CategoryIngredientMapperHelper.class
})
public interface IngredientMapper2 {
        IngredientInfoResponseDTO entityToInfoResponse(IngredientEntity ingredientEntity);
}
