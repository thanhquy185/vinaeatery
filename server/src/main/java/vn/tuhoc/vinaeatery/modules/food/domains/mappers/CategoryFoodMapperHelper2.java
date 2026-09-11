package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodInfoResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryFoodMapperHelper2 {
    final CategoryFoodMapper2 categoryFoodMapper2;

    public CategoryFoodInfoResponseDTO mapToInfoResponse(CategoryFoodEntity categoryFoodEntity) {
        return this.categoryFoodMapper2.entityToInfoResponse(categoryFoodEntity);
    }
}