package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class PermissionDetailMapperHelper {
    private final PermissionDetailMapper permissionDetailMapper;

    public PermissionDDetailResponseDTO mapToDetailResponse(PermissionDetailEntity permissionDetailEntity) {
        return this.permissionDetailMapper.entityToDetailResponse(permissionDetailEntity);
    }
}