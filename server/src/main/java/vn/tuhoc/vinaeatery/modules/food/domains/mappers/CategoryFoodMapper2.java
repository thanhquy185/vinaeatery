package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface CategoryFoodMapper2 {
        CategoryFoodInfoResponseDTO entityToInfoResponse(CategoryFoodEntity categoryFoodEntity);
}
