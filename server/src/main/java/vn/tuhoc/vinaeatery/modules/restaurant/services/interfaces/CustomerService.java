package vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.CustomerCriteria;

public interface CustomerService {
        CustomerDetailResponseDTO handleGetDetailById(Integer id);

        CustomerDetailResponseDTO handleGetDetailByUserId(Integer userId);

        CustomerDetailResponseDTO handleGetDetailByEmail(String email);

        CustomerEntity handleGetOneByEmailNotThrowException(String email);

        PageResponseDTO<CustomerSummaryResponseDTO> handleGetSummary(CustomerCriteria customerCriteria);

        List<CustomerCrudResponseDTO> handleGetCrud();

        CustomerDetailResponseDTO handleCreate(MultipartFile imageFile,
                        CustomerCreateRequestDTO customerCreateRequestDTO);

        CustomerDetailResponseDTO handleRegister(CustomerRegisterRequestDTO customerRegisterRequestDTO);

        CustomerDetailResponseDTO handleUpdate(
                        Integer id,
                        MultipartFile imageFile,
                        CustomerUpdateRequestDTO customerUpdateRequestDTO);

        CustomerDetailResponseDTO handleDelete(
                        Integer id,
                        CustomerDeleteRequestDTO customerDeleteRequestDTO);
}
