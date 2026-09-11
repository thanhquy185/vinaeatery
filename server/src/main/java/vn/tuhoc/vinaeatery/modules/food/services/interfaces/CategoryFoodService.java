package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface CategoryFoodService {
    CategoryFoodDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<CategoryFoodSummaryResponseDTO> handleGetSummary(CategoryFoodCriteria categoryFoodCriteria);

    List<CategoryFoodCrudResponseDTO> handleGetCrud();

    List<CategoryFoodCrudResponseDTO> handleGetCrud(Integer restaurantId);

    CategoryFoodDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            CategoryFoodCreateRequestDTO categoryFoodCreateRequestDTO);

    CategoryFoodDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            CategoryFoodUpdateRequestDTO categoryFoodUpdateRequestDTO);

    CategoryFoodDetailResponseDTO handleDelete(
                        Integer id,
                        CategoryFoodDeleteRequestDTO categoryFoodDeleteRequestDTO);
}
