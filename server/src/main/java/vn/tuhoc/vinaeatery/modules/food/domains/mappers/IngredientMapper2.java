package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientInfoResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                CategoryIngredientMapperHelper.class
})
public interface IngredientMapper2 {
        IngredientInfoResponseDTO entityToInfoResponse(IngredientEntity ingredientEntity);
}
