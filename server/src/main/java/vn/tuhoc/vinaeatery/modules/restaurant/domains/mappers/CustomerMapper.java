package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.UserMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerSummaryResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                UserMapperHelper.class,
})
public interface CustomerMapper {
        CustomerDetailResponseDTO entityToDetailResponse(CustomerEntity customerEntity);

        CustomerSummaryResponseDTO entityToSummaryResponse(CustomerEntity customerEntity);

        CustomerCrudResponseDTO entityToCrudResponse(CustomerEntity customerEntity);

        CustomerInfoResponseDTO entityToInfoResponse(CustomerEntity customerEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", source = "userId")
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        CustomerEntity createEntityFromRequest(
                        Integer userId,
                        String imageUrl,
                        String imagePublicId,
                        CustomerCreateRequestDTO customerCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", source = "userId")
        @Mapping(target = "imageUrl", source = "imageUrl")
        CustomerEntity createEntityFromRegister(
                        Integer userId,
                        String imageUrl,
                        CustomerRegisterRequestDTO CustomerRegisterRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "user", ignore = true)
        @Mapping(target = "imageUrl", source = "imageUrl")
        @Mapping(target = "imagePublicId", source = "imagePublicId")
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        String imageUrl,
                        String imagePublicId,
                        CustomerUpdateRequestDTO customerUpdateRequestDTO,
                        @MappingTarget CustomerEntity CustomerEntity);

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
                        CustomerDeleteRequestDTO customerDeleteRequestDTO,
                        @MappingTarget CustomerEntity CustomerEntity);
}
