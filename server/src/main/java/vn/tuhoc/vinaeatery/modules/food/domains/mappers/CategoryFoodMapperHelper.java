package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.CategoryFoodRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryFoodMapperHelper {
    final CategoryFoodRepository categoryFoodRepository;
    final CategoryFoodMapper categoryFoodMapper;

    public CategoryFoodEntity mapToEntity(Integer id) {
        return this.categoryFoodRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new CategoryFoodNotFoundByIdException(id));
    }

    public CategoryFoodDetailResponseDTO mapToDetailResponse(CategoryFoodEntity categoryFoodEntity) {
        return this.categoryFoodMapper.entityToDetailResponse(categoryFoodEntity);
    }

    public CategoryFoodSummaryResponseDTO mapToSummaryResponse(CategoryFoodEntity categoryFoodEntity) {
        return this.categoryFoodMapper.entityToSummaryResponse(categoryFoodEntity);
    }

    public CategoryFoodCrudResponseDTO mapToCrudResponse(CategoryFoodEntity categoryFoodEntity) {
        return this.categoryFoodMapper.entityToCrudResponse(categoryFoodEntity);
    }

    public CategoryFoodInfoResponseDTO mapToInfoResponse(CategoryFoodEntity categoryFoodEntity) {
        return this.categoryFoodMapper.entityToInfoResponse(categoryFoodEntity);
    }
}