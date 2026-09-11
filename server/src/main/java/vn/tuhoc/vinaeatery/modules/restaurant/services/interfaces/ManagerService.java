package vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.ManagerCriteria;

public interface ManagerService {
    ManagerDetailResponseDTO handleGetDetailById(Integer id);

    ManagerDetailResponseDTO handleGetDetailByUserId(Integer userId);

    PageResponseDTO<ManagerSummaryResponseDTO> handleGetSummary(ManagerCriteria managerCriteria);

    List<ManagerCrudResponseDTO> handleGetCrud();

    ManagerDetailResponseDTO handleCreate(MultipartFile imageFile, ManagerCreateRequestDTO managerCreateRequestDTO);

    ManagerDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            ManagerUpdateRequestDTO managerUpdateRequestDTO);

    public ManagerDetailResponseDTO handleDelete(
            Integer id,
            ManagerDeleteRequestDTO managerDeleteRequestDTO);
}
