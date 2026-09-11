package vn.tuhoc.vinaeatery.modules.auth.services.interfaces;

import org.springframework.data.domain.Page;

import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserChangePasswordRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.repositories.criteria.UserCriteria;

public interface UserService {
    UserDetailResponseDTO handleGetDetailById(Integer id);

    UserDetailResponseDTO handleGetDetailByUsername(String username);

    UserEntity handleGetByUsername(String username);

    UserEntity handleGetByUsernameForLogin(String username);

    Page<UserSummaryResponseDTO> handleGetSummary(UserCriteria userCriteria);

    UserDetailResponseDTO handleCreate(UserCreateRequestDTO userCreateRequestDTO);

    UserDetailResponseDTO handleChangePassword(
            Integer id,
            UserChangePasswordRequestDTO userChangePasswordRequestDTO);

    UserDetailResponseDTO handleDelete(
            Integer id,
            UserDeleteRequestDTO userDeleteRequestDTO);
}
