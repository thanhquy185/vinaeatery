package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleHistoryCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleHistoryDetailResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RoleMapperHelper.class
})
public interface RoleHistoryMapper {
        @Mapping(target = "dateStart", source = "id.dateStart")
        RoleHistoryDetailResponseDTO entityToDetailResponse(RoleHistoryEntity roleHistoryEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "role", source = "roleId")
        @Mapping(target = "id.dateStart", source = "dateStart")
        @Mapping(target = "dateEnd", ignore = true)
        RoleHistoryEntity createEntityFromRequest(
                        RoleHistoryCreateRequestDTO roleHistoryCreateRequestDTO);
}
