package vn.tuhoc.vinaeatery.modules.auth.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserChangePasswordRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {
        UserDetailResponseDTO entityToDetailResponse(UserEntity userEntity);

        UserSummaryResponseDTO entityToSummaryResponse(UserEntity userEntity);

        UserInfoResponseDTO entityToInfoResponse(UserEntity userEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        UserEntity createEntityFromRequest(UserCreateRequestDTO userCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "role", ignore = true)
        @Mapping(target = "username", ignore = true)
        @Mapping(target = "password", ignore = true)
        @Mapping(target = "method", ignore = true)
        void deleteEntityFromRequest(
                        UserDeleteRequestDTO userDeleteRequestDTO,
                        @MappingTarget UserEntity userEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "role", ignore = true)
        @Mapping(target = "username", ignore = true)
        @Mapping(target = "password", source = "newPassword")
        @Mapping(target = "method", ignore = true)
        @Mapping(target = "status", ignore = true)
        void changePasswordEntityFromRequest(
                        String newPassword,
                        UserChangePasswordRequestDTO userChangePasswordRequestDTO,
                        @MappingTarget UserEntity userEntity);
}
