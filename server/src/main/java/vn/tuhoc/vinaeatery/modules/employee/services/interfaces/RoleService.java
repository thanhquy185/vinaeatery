package vn.tuhoc.vinaeatery.modules.employee.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface RoleService {
    RoleDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<RoleSummaryResponseDTO> handleGetSummary(RoleCriteria roleCriteria);

    List<RoleCrudResponseDTO> handleGetCrud();

    List<RoleCrudResponseDTO> handleGetCrud(Integer restaurantId);

    RoleDetailResponseDTO handleCreate(RoleCreateRequestDTO roleCreateRequestDTO);

    RoleDetailResponseDTO handleUpdate(Integer id, RoleUpdateRequestDTO roleUpdateRequestDTO);

    RoleDetailResponseDTO handleDelete(Integer id, RoleDeleteRequestDTO roleDeleteRequestDTO);
}
