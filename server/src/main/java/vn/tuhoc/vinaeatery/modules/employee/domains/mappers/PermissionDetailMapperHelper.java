package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionDetailMapperHelper {
    final PermissionDetailMapper permissionDetailMapper;

    public PermissionDDetailResponseDTO mapToDetailResponse(PermissionDetailEntity permissionDetailEntity) {
        return this.permissionDetailMapper.entityToDetailResponse(permissionDetailEntity);
    }
}