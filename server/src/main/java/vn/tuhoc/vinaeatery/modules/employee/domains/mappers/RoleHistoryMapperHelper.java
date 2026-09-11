package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleHistoryDetailResponseDTO;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleHistoryMapperHelper {
    final RoleHistoryMapper roleHistoryMapper;

    public RoleHistoryDetailResponseDTO mapToDetailResponse(RoleHistoryEntity roleHistoryEntity) {
        return this.roleHistoryMapper.entityToDetailResponse(roleHistoryEntity);
    }
}