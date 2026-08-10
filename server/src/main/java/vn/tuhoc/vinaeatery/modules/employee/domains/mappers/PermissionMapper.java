package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                PermissionDetailMapperHelper.class
})
public interface PermissionMapper {
        PermissionDetailResponseDTO entityToDetailResponse(PermissionEntity permissionEntity);

        PermissionSummaryResponseDTO entityToSummaryResponse(PermissionEntity permissionEntity);

        PermissionCrudResponseDTO entityToCrudResponse(PermissionEntity permissionEntity);

        PermissionInfoResponseDTO entityToInfoResponse(PermissionEntity permissionEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "permissionDetails", ignore = true)
        PermissionEntity createEntityFromRequest(PermissionCreateRequestDTO permissionCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "permissionDetails", ignore = true)
        void updateEntityFromRequest(
                        PermissionUpdateRequestDTO permissionUpdateRequestDTO,
                        @MappingTarget PermissionEntity permissionEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "permissionDetails", ignore = true)
        void deleteEntityFromRequest(
                        PermissionDeleteRequestDTO permissionDeleteRequestDTO,
                        @MappingTarget PermissionEntity permissionEntity);
}
