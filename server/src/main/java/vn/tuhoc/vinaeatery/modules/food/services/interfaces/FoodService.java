package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface FoodService {
    FoodDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<FoodSummaryResponseDTO> handleGetSummary(FoodCriteria foodCriteria);

    List<FoodCrudResponseDTO> handleGetCrud();

    List<FoodCrudResponseDTO> handleGetCrud(Integer restaurantId);

    FoodDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            FoodCreateRequestDTO foodCreateRequestDTO);

    FoodDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            FoodUpdateRequestDTO foodUpdateRequestDTO);

    FoodDetailResponseDTO handleDelete(
            Integer id,
            FoodDeleteRequestDTO foodDeleteRequestDTO);
}
