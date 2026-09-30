package vn.tuhoc.vinaeatery.modules.auth.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.repositories.UserRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserMapperHelper {
    UserRepository userRepository;
    UserMapper userMapper;

    public UserEntity mapToEntity(Integer id) {
        return this.userRepository.findById(id).get();
    }

    public UserDetailResponseDTO mapToDetailResponse(UserEntity userEntity) {
        return this.userMapper.entityToDetailResponse(userEntity);
    }

    public UserSummaryResponseDTO mapToSummaryResponse(UserEntity userEntity) {
        return this.userMapper.entityToSummaryResponse(userEntity);
    }

    public UserInfoResponseDTO mapToInfoResponse(UserEntity userEntity) {
        return this.userMapper.entityToInfoResponse(userEntity);
    }
}