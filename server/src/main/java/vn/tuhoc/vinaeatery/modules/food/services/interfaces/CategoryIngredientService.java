package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface CategoryIngredientService {
    CategoryIngredientDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<CategoryIngredientSummaryResponseDTO> handleGetSummary(
            CategoryIngredientCriteria categoryIngredientCriteria);

    List<CategoryIngredientCrudResponseDTO> handleGetCrud();

    List<CategoryIngredientCrudResponseDTO> handleGetCrud(Integer restaurantId);

    CategoryIngredientDetailResponseDTO handleCreate(
            CategoryIngredientCreateRequestDTO categoryIngredientCreateRequestDTO);

    CategoryIngredientDetailResponseDTO handleUpdate(
            Integer id,
            CategoryIngredientUpdateRequestDTO categoryIngredientUpdateRequestDTO);

    CategoryIngredientDetailResponseDTO handleDelete(
            Integer id,
            CategoryIngredientDeleteRequestDTO categoryIngredientDeleteRequestDTO);
}
