package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.PermissionRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionMapperHelper {
    final PermissionRepository permissionRepository;
    final PermissionMapper permissionMapper;

    public PermissionEntity mapToEntity(Integer id) {
        return this.permissionRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new PermissionNotFoundByIdException(id));
    }

    public PermissionDetailResponseDTO mapToDetailResponse(PermissionEntity permissionEntity) {
        return this.permissionMapper.entityToDetailResponse(permissionEntity);
    }

    public PermissionSummaryResponseDTO mapToSummaryResponse(PermissionEntity permissionEntity) {
        return this.permissionMapper.entityToSummaryResponse(permissionEntity);
    }

    public PermissionCrudResponseDTO mapToCrudResponse(PermissionEntity permissionEntity) {
        return this.permissionMapper.entityToCrudResponse(permissionEntity);
    }

    public PermissionInfoResponseDTO mapToInfoResponse(PermissionEntity permissionEntity) {
        return this.permissionMapper.entityToInfoResponse(permissionEntity);
    }
}