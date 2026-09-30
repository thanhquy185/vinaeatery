package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.UserMapperHelper;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                UserMapperHelper.class,
                RoleMapperHelper.class,
                RoleHistoryMapperHelper.class,
                PermissionMapperHelper.class
})
public interface EmployeeMapper {
        EmployeeDetailResponseDTO entityToDetailResponse(EmployeeEntity employeeEntity);

        EmployeeDetail2ResponseDTO entityToDetail2Response(EmployeeEntity employeeEntity);

        EmployeeSummaryResponseDTO entityToSummaryResponse(EmployeeEntity employeeEntity);

        EmployeeCrudResponseDTO entityToCrudResponse(EmployeeEntity employeeEntity);

        EmployeeInfoResponseDTO entityToInfoResponse(EmployeeEntity employeeEntity);

        EmployeeSubInfoResponseDTO entityToSubInfoResponse(EmployeeEntity employeeEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "employeeCreateRequestDTO.restaurantId")
        @Mapping(target = "user", source = "userId")
        @Mapping(target = "role", source = "employeeCreateRequestDTO.roleId")
        @Mapping(target = "permission", source = "employeeCreateRequestDTO.permissionId")
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "roleHistories", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        EmployeeEntity createEntityFromRequest(
                        Integer userId,
                        String imageUrl,
                        String imagePublicId,
                        EmployeeCreateRequestDTO employeeCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "user", ignore = true)
        @Mapping(target = "role", source = "employeeUpdateRequestDTO.roleId")
        @Mapping(target = "permission", source = "employeeUpdateRequestDTO.permissionId")
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "roleHistories", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        void updateEntityFromRequest(
                        String imageUrl,
                        String imagePublicId,
                        EmployeeUpdateRequestDTO employeeUpdateRequestDTO,
                        @MappingTarget EmployeeEntity employeeEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "user", ignore = true)
        @Mapping(target = "role", ignore = true)
        @Mapping(target = "permission", ignore = true)
        @Mapping(target = "imageUrl", ignore = true)
        @Mapping(target = "imagePublicId", ignore = true)
        @Mapping(target = "fullname", ignore = true)
        @Mapping(target = "birthdate", ignore = true)
        @Mapping(target = "gender", ignore = true)
        @Mapping(target = "phone", ignore = true)
        @Mapping(target = "email", ignore = true)
        @Mapping(target = "houseNumber", ignore = true)
        @Mapping(target = "streetName", ignore = true)
        @Mapping(target = "ward", ignore = true)
        @Mapping(target = "province", ignore = true)
        @Mapping(target = "description", ignore = true)
        @Mapping(target = "roleHistories", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        void deleteEntityFromRequest(
                        EmployeeDeleteRequestDTO employeeDeleteRequestDTO,
                        @MappingTarget EmployeeEntity employeeEntity);
}
