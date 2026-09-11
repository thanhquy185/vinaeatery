package vn.tuhoc.vinaeatery.modules.employee.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface PermissionService {
    PermissionDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<PermissionSummaryResponseDTO> handleGetSummary(PermissionCriteria permissionCriteria);

    List<PermissionCrudResponseDTO> handleGetCrud();

    List<PermissionCrudResponseDTO> handleGetCrud(Integer restaurantId);

    PermissionDetailResponseDTO handleCreate(PermissionCreateRequestDTO permissionCreateRequestDTO);

    PermissionDetailResponseDTO handleUpdate(
            Integer id,
            PermissionUpdateRequestDTO permissionUpdateRequestDTO);

    PermissionDetailResponseDTO handleDelete(
            Integer id,
            PermissionDeleteRequestDTO permissionDeleteRequestDTO);
}
