package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.UserMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerSummaryResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                UserMapperHelper.class
})
public interface ManagerMapper {
        ManagerDetailResponseDTO entityToDetailResponse(ManagerEntity managerEntity);

        ManagerSummaryResponseDTO entityToSummaryResponse(ManagerEntity managerEntity);

        ManagerCrudResponseDTO entityToCrudResponse(ManagerEntity managerEntity);

        ManagerInfoResponseDTO entityToInfoResponse(ManagerEntity managerEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", source = "userId")
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        ManagerEntity createEntityFromRequest(
                        Integer userId,
                        String imageUrl,
                        String imagePublicId,
                        ManagerCreateRequestDTO managerCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", ignore = true)
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        String imageUrl,
                        String imagePublicId,
                        ManagerUpdateRequestDTO managerUpdateRequestDTO,
                        @MappingTarget ManagerEntity managerEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", ignore = true)
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
        void deleteEntityFromRequest(
                        ManagerDeleteRequestDTO managerDeleteRequestDTO,
                        @MappingTarget ManagerEntity managerEntity);
}
