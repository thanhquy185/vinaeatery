package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO2;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO3;

@Mapper(config = CentralMapperConfig.class, uses = {
                CategoryFoodMapperHelper2.class,
                RecipeMapperHelper2.class
})
public interface FoodMapper2 {
        FoodInfoResponseDTO entityToInfoResponse(FoodEntity foodEntity);

        FoodInfoResponseDTO2 entityToInfoResponse2(FoodEntity foodEntity);

        @Mapping(target = "recipes", ignore = true)
        FoodInfoResponseDTO3 entityToInfoResponse3(FoodEntity foodEntity);
}
