package vn.tuhoc.vinaeatery.modules.employee.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface EmployeeService {
    EmployeeDetailResponseDTO handleGetDetailById(Integer id);

    EmployeeDetail2ResponseDTO handleGetDetail2ByUserId(Integer userId);

    PageResponseDTO<EmployeeSummaryResponseDTO> handleGetSummary(EmployeeCriteria employeeCriteria);

    List<EmployeeCrudResponseDTO> handleGetCrud();

    List<EmployeeCrudResponseDTO> handleGetCrud(Integer restaurantId);

    EmployeeDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            EmployeeCreateRequestDTO employeeCreateRequestDTO);

    EmployeeDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    EmployeeDetailResponseDTO handleDelete(
            Integer id,
            EmployeeDeleteRequestDTO employeeDeleteRequestDTO);
}
