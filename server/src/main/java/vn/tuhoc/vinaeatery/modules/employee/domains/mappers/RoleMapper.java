package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
})
public interface RoleMapper {
        RoleDetailResponseDTO entityToDetailResponse(RoleEntity roleEntity);

        RoleSummaryResponseDTO entityToSummaryResponse(RoleEntity roleEntity);

        RoleCrudResponseDTO entityToCrudResponse(RoleEntity roleEntity);

        RoleInfoResponseDTO entityToInfoResponse(RoleEntity roleEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        RoleEntity createEntityFromRequest(RoleCreateRequestDTO roleCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        RoleUpdateRequestDTO roleUpdateRequestDTO,
                        @MappingTarget RoleEntity roleEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "salaryType", ignore = true)
        @Mapping(target = "salaryValue", ignore = true)
        void deleteEntityFromRequest(
                        RoleDeleteRequestDTO roleDeleteRequestDTO,
                        @MappingTarget RoleEntity roleEntity);
}
