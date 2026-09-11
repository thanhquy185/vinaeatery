package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDetailUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDDetailResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                FunctionMapperHelper.class
})
public interface PermissionDetailMapper {
        @Mapping(target = "action", source = "id.action")
        PermissionDDetailResponseDTO entityToDetailResponse(PermissionDetailEntity permissionDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "permission", ignore = true)
        @Mapping(target = "function", source = "functionId")
        @Mapping(target = "id.action", source = "action")
        PermissionDetailEntity createEntityFromRequest(
                        PermissionDetailCreateRequestDTO permissionDetailCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "permission", ignore = true)
        @Mapping(target = "function", source = "functionId")
        @Mapping(target = "id.action", source = "action")
        PermissionDetailEntity createEntityFromRequest(
                        PermissionDetailUpdateRequestDTO permissionDetailUpdateRequestDTO);
}
