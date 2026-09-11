package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface IngredientService {
    IngredientDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<IngredientSummaryResponseDTO> handleGetSummary(IngredientCriteria ingredientCriteria);

    List<IngredientCrudResponseDTO> handleGetCrud();

    List<IngredientCrudResponseDTO> handleGetCrud(Integer restaurantId);

    IngredientDetailResponseDTO handleCreate(IngredientCreateRequestDTO ingredientCreateRequestDTO);

    IngredientDetailResponseDTO handleUpdate(Integer id, IngredientUpdateRequestDTO ingredientUpdateRequestDTO);

    IngredientDetailResponseDTO handleDelete(Integer id, IngredientDeleteRequestDTO IngredientDeleteRequestDTO);
}
