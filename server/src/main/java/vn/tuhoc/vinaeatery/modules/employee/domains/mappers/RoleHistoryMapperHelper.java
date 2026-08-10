package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleHistoryDetailResponseDTO;

@Component
@RequiredArgsConstructor
public class RoleHistoryMapperHelper {
    private final RoleHistoryMapper roleHistoryMapper;

    public RoleHistoryDetailResponseDTO mapToDetailResponse(RoleHistoryEntity roleHistoryEntity) {
        return this.roleHistoryMapper.entityToDetailResponse(roleHistoryEntity);
    }
}