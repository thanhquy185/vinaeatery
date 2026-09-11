package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.repositories.CategoryIngredientRepository;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryIngredientNotFoundByIdException;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryIngredientMapperHelper {
    final CategoryIngredientRepository categoryIngredientRepository;
    final CategoryIngredientMapper categoryIngredientMapper;

    public CategoryIngredientEntity mapToEntity(Integer id) {
        return this.categoryIngredientRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new CategoryIngredientNotFoundByIdException(id));
    }

    public CategoryIngredientDetailResponseDTO mapToDetailResponse(
            CategoryIngredientEntity categoryIngredientEntity) {
        return this.categoryIngredientMapper.entityToDetailResponse(categoryIngredientEntity);
    }

    public CategoryIngredientSummaryResponseDTO mapToSummaryResponse(
            CategoryIngredientEntity categoryIngredientEntity) {
        return this.categoryIngredientMapper.entityToSummaryResponse(categoryIngredientEntity);
    }

    public CategoryIngredientCrudResponseDTO mapToCrudResponse(
            CategoryIngredientEntity categoryIngredientEntity) {
        return this.categoryIngredientMapper.entityToCrudResponse(categoryIngredientEntity);
    }

    public CategoryIngredientInfoResponseDTO mapToInfoResponse(
            CategoryIngredientEntity categoryIngredientEntity) {
        return this.categoryIngredientMapper.entityToInfoResponse(categoryIngredientEntity);
    }
}