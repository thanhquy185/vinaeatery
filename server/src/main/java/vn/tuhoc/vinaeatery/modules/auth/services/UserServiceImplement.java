package vn.tuhoc.vinaeatery.modules.auth.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity_;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.UserMapper;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserChangePasswordRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserUsernameIsExistsException;
import vn.tuhoc.vinaeatery.modules.auth.repositories.UserRepository;
import vn.tuhoc.vinaeatery.modules.auth.repositories.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.modules.auth.repositories.specifications.UserSpecification;
import vn.tuhoc.vinaeatery.modules.auth.services.interfaces.UserService;
import vn.tuhoc.vinaeatery.utils.PasswordUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImplement implements UserService {
    PasswordUtil passwordUtil;
    UserRepository userRepository;
    UserMapper userMapper;

    private Boolean existsByUsername(String username) {
        return this.userRepository.existsByUsername(username);
    }

    private UserEntity getOneById(Integer id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundByIdException(id));
    }

    private UserEntity getOneByUsername(String username) {
        return this.userRepository.findOneByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
    }

    private UserEntity getOneByUsernameForLogin(String username) {
        return this.userRepository.findOneByUsername(username).orElse(null);
    }

    private Page<UserEntity> getAll(UserCriteria userCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(userCriteria.getSort())) {
            String sortString = userCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "Mã tăng dần" -> sort = Sort.by(UserEntity_.ID).ascending();
                case "Mã giảm dần" -> sort = Sort.by(UserEntity_.ID).descending();
                case "Quyền tăng dần" -> sort = Sort.by(UserEntity_.ROLE).ascending();
                case "Quyền giảm dần" -> sort = Sort.by(UserEntity_.ROLE).descending();
                case "Tên tài khoản tăng dần" -> sort = Sort.by(UserEntity_.USERNAME).ascending();
                case "Tên tài khoản giảm dần" -> sort = Sort.by(UserEntity_.USERNAME).descending();
                case "Phương thức tạo tăng dần" -> sort = Sort.by(UserEntity_.METHOD).ascending();
                case "Phương thức tạo giảm dần" -> sort = Sort.by(UserEntity_.METHOD).descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(userCriteria.getPage())
                && ValidationUtil.nonNull(userCriteria.getSize())) {
            pageable = PageRequest.of(
                    userCriteria.getPage(),
                    userCriteria.getSize(),
                    sort);
        }

        Specification<UserEntity> specification = UserSpecification.filterUsers(userCriteria);

        return this.userRepository.findAll(specification, pageable);
    }

    @Override
    public UserDetailResponseDTO handleGetDetailById(Integer id) {
        return this.userMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    public UserDetailResponseDTO handleGetDetailByUsername(String username) {
        return this.userMapper.entityToDetailResponse(this.getOneByUsername(username));
    }

    @Override
    public UserEntity handleGetByUsername(String username) {
        return this.getOneByUsername(username);
    }

    @Override
    public UserEntity handleGetByUsernameForLogin(String username) {
        return this.getOneByUsernameForLogin(username);
    }

    @Override
    public Page<UserSummaryResponseDTO> handleGetSummary(UserCriteria userCriteria) {
        return this.getAll(userCriteria).map(this.userMapper::entityToSummaryResponse);
    }

    @Override
    public UserDetailResponseDTO handleCreate(UserCreateRequestDTO userCreateRequestDTO) {
        if (this.existsByUsername(userCreateRequestDTO.getUsername())) {
            throw new UserUsernameIsExistsException(userCreateRequestDTO.getUsername());
        }

        UserEntity userEntity = this.userMapper
                .createEntityFromRequest(userCreateRequestDTO);

        String hashPassword = this.passwordUtil.getPasswordEncoder().encode(userCreateRequestDTO.getPassword());
        userEntity.setPassword(hashPassword);

        return this.userMapper.entityToDetailResponse(this.userRepository.save(userEntity));
    }

    @Override
    public UserDetailResponseDTO handleChangePassword(
            Integer id,
            UserChangePasswordRequestDTO userChangePasswordRequestDTO) {
        UserEntity userEntity = this.getOneById(id);

        String newPasswordRequest = userChangePasswordRequestDTO.getNewPassword();
        String newPassword2Request = userChangePasswordRequestDTO.getNewPassword2();
        this.passwordUtil.handlePasswordIsNotMatch(newPasswordRequest, newPassword2Request);
        this.passwordUtil.handlePasswordIsUsing(userEntity.getPassword(), newPasswordRequest);

        String newPassword = this.passwordUtil.getPasswordEncoder().encode(newPasswordRequest);
        this.userMapper.changePasswordEntityFromRequest(
                newPassword, userChangePasswordRequestDTO, userEntity);

        return this.userMapper.entityToDetailResponse(userEntity);
    }

    @Override
    public UserDetailResponseDTO handleDelete(
            Integer id,
            UserDeleteRequestDTO userDeleteRequestDTO) {
        UserEntity userEntity = this.getOneById(id);
        this.userMapper.deleteEntityFromRequest(userDeleteRequestDTO, userEntity);

        return this.userMapper.entityToDetailResponse(userEntity);
    }
}
