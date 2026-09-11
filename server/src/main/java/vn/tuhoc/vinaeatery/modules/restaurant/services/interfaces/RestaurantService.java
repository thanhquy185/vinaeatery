package vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantManagerResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.RestaurantCriteria;

public interface RestaurantService {
    RestaurantDetailResponseDTO handleGetDetailById(Integer id);

    RestaurantPublicDetailResponseDTO handleGetPublicDetailById(Integer id);

    PageResponseDTO<RestaurantSummaryResponseDTO> handleGetSummary(RestaurantCriteria restaurantCriteria);

    PageResponseDTO<RestaurantPublicResponseDTO> handleGetPublic(RestaurantCriteria restaurantCriteria);

    List<RestaurantManagerResponseDTO> handleGetAllByManagerId(Integer managerId);

    List<RestaurantCrudResponseDTO> handleGetCrud();

    RestaurantDetailResponseDTO handleCreate(
            MultipartFile[] imageFiles,
            RestaurantCreateRequestDTO restaurantCreateRequestDTO);

    RestaurantDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile[] imageFiles,
            RestaurantUpdateRequestDTO restaurantUpdateRequestDTO);

    RestaurantDetailResponseDTO handleDelete(
            Integer id,
            RestaurantDeleteRequestDTO restaurantDeleteRequestDTO);
}
