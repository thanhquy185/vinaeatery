package vn.tuhoc.vinaeatery.modules.auth.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity_;
import vn.tuhoc.vinaeatery.modules.auth.domains.mappers.UserMapper;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserChangePasswordRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameAndPasswordException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameAndRefreshTokenException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsUsingException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsNotMatchException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserUsernameIsExistsException;
import vn.tuhoc.vinaeatery.modules.auth.repositories.UserRepository;
import vn.tuhoc.vinaeatery.modules.auth.repositories.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.modules.auth.repositories.specifications.UserSpecification;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private UserEntity getOneById(Integer id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundByIdException(id));
    }

    public UserEntity getOneByUsername(String username) {
        return this.userRepository.findOneByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
    }

    public UserEntity getOneByUsernameForLogin(String username) {
        return this.userRepository.findOneByUsername(username).orElse(null);
    }

    public UserEntity getOneByUsernameAndPassword(String username, String password) {
        return this.userRepository.findOneByUsernameAndPassword(username, password)
                .orElseThrow(() -> new UserNotFoundByUsernameAndPasswordException(username, password));
    }

    public UserEntity getOneByUsernameAndRefreshToken(String username, String refreshToken) {
        return this.userRepository.findOneByUsernameAndRefreshToken(username, refreshToken)
                .orElseThrow(() -> new UserNotFoundByUsernameAndRefreshTokenException(username, refreshToken));
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

    public UserDetailResponseDTO handleGetDetailById(Integer id) {
        return this.userMapper.entityToDetailResponse(this.getOneById(id));
    }

    public UserDetailResponseDTO handleGetDetailByUsername(String username) {
        return this.userMapper.entityToDetailResponse(this.getOneByUsername(username));
    }

    public Page<UserSummaryResponseDTO> handleGetSummary(UserCriteria userCriteria) {
        return this.getAll(userCriteria).map(this.userMapper::entityToSummaryResponse);
    }

    public Boolean existsByUsername(String username) {
        return this.userRepository.existsByUsername(username);
    }

    public void handleExistsByUsername(String username) {
        if (this.existsByUsername(username)) {
            throw new UserUsernameIsExistsException(username);
        }
    }

    public void handlePasswordIsNotMatch(String newPassword, String newPassword2) {
        if (!newPassword.equals(newPassword2)) {
            throw new UserPasswordIsNotMatchException(newPassword, newPassword2);
        }
    }

    public void handlePasswordIsUsing(String currentPassword, String newPassword) {
        if (this.passwordEncoder.matches(newPassword, currentPassword)) {
            throw new UserPasswordIsUsingException(newPassword);
        }
    }

    public UserDetailResponseDTO handleCreate(UserCreateRequestDTO userCreateRequestDTO) {
        this.handleExistsByUsername(userCreateRequestDTO.getUsername());

        UserEntity userEntity = this.userMapper
                .createEntityFromRequest(userCreateRequestDTO);

        String hashPassword = this.passwordEncoder.encode(userCreateRequestDTO.getPassword());
        userEntity.setPassword(hashPassword);

        return this.userMapper.entityToDetailResponse(this.userRepository.save(userEntity));
    }

    public UserDetailResponseDTO handleChangePassword(
            Integer id,
            UserChangePasswordRequestDTO userChangePasswordRequestDTO) {
        UserEntity userEntity = this.getOneById(id);

        String newPasswordRequest = userChangePasswordRequestDTO.getNewPassword();
        String newPassword2Request = userChangePasswordRequestDTO.getNewPassword2();
        this.handlePasswordIsNotMatch(newPasswordRequest, newPassword2Request);
        this.handlePasswordIsUsing(userEntity.getPassword(), newPasswordRequest);

        String newPassword = this.passwordEncoder.encode(newPasswordRequest);
        this.userMapper.changePasswordEntityFromRequest(
                newPassword, userChangePasswordRequestDTO, userEntity);

        return this.userMapper.entityToDetailResponse(userEntity);
    }

    public UserDetailResponseDTO handleChangeRefreshToken(String username, String refreshToken) {
        UserEntity userEntity = this.getOneByUsername(username);
        userEntity.setRefreshToken(refreshToken);

        return this.userMapper.entityToDetailResponse(userEntity);
    }

    public UserDetailResponseDTO handleDelete(
            Integer id,
            UserDeleteRequestDTO userDeleteRequestDTO) {
        UserEntity userEntity = this.getOneById(id);
        this.userMapper.deleteEntityFromRequest(userDeleteRequestDTO, userEntity);

        return this.userMapper.entityToDetailResponse(userEntity);
    }
}
