package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.RoleRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleMapperHelper {
    final RoleRepository roleRepository;
    final RoleMapper roleMapper;

    public RoleEntity mapToEntity(Integer id) {
        return this.roleRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new RoleNotFoundByIdException(id));
    }

    public RoleDetailResponseDTO mapToDetailResponse(RoleEntity roleEntity) {
        return this.roleMapper.entityToDetailResponse(roleEntity);
    }

    public RoleSummaryResponseDTO mapToSummaryResponse(RoleEntity roleEntity) {
        return this.roleMapper.entityToSummaryResponse(roleEntity);
    }

    public RoleCrudResponseDTO mapToCrudResponse(RoleEntity roleEntity) {
        return this.roleMapper.entityToCrudResponse(roleEntity);
    }

    public RoleInfoResponseDTO mapToInfoResponse(RoleEntity roleEntity) {
        return this.roleMapper.entityToInfoResponse(roleEntity);
    }
}