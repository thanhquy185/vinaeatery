package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.UserCriteria;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.entity.User_;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;
import vn.tuhoc.vinaeatery.repository.UserRepository;
import vn.tuhoc.vinaeatery.service.specification.EmployeeSpecification;
import vn.tuhoc.vinaeatery.service.specification.UserSpecification;

@Service
@RequiredArgsConstructor
public class UserService {
    // Properties
    private final UserRepository userRepository;

    // Methods
    public User getOneById(Integer id) {
        return this.userRepository.findOneById(id);
    }

    public User getOneByUsername(String username) {
        return this.userRepository.findOneByUsername(username);
    }

    public User getOneByUsernameAndPassword(String username, String password) {
        return this.userRepository.findOneByUsernameAndPassword(username, password);
    }

    public User getOneByUsernameAndRefreshToken(String username, String refreshToken) {
        return this.userRepository.findOneByUsernameAndRefreshToken(username, refreshToken);
    }

    public List<User> getAll() {
        return this.userRepository.findAll();
    }

    public List<User> getAll(UserCriteria userCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (userCriteria.getSort() != null && userCriteria.getSort().isPresent()) {
            String sortStr = userCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(User_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(User_.ID).descending();
                case "Tên tài khoản  tăng dần" -> sort = Sort.by(User_.USERNAME).ascending();
                case "Tên tài khoản  giảm dần" -> sort = Sort.by(User_.USERNAME).descending();
            }
        }

        //
        if (userCriteria.getId() == null
                && userCriteria.getUsername() == null
                && userCriteria.getRole() == null
                && userCriteria.getMethod() == null
                && userCriteria.getIsUsing() == null
                && userCriteria.getStatus() == null
                && userCriteria.getSort() == null) {
            return this.userRepository.findAll(sort);
        }

        //
        Specification<User> combinedSpec = Specification.where(null);
        if (userCriteria.getId() != null && userCriteria.getId().isPresent()) {
            if (userCriteria.getId().get().matches("\\d+")) {
                Specification<User> currentSpec = UserSpecification.idEqual(userCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (userCriteria.getUsername() != null && userCriteria.getUsername().isPresent()) {
            Specification<User> currentSpec = UserSpecification.usernameLike(userCriteria.getUsername().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (userCriteria.getRole() != null && userCriteria.getRole().isPresent()) {
            String roleString = userCriteria.getRole().get();
            String roleStringV = new String();
            for (UserRoleEnum role : UserRoleEnum.values()) {
                if (role.getDescription().equals(roleString)) {
                    roleStringV = role.getValue();
                    break;
                }
            }
            Specification<User> currentSpec = UserSpecification.roleEqual(roleStringV);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (userCriteria.getMethod() != null && userCriteria.getMethod().isPresent()) {
            String methodString = userCriteria.getMethod().get();
            String methodStringV = "";
            for (UserMethodEnum method : UserMethodEnum.values()) {
                if (method.getDescription().equals(methodString)) {
                    methodStringV = method.getValue();
                    break;
                }
            }
            Specification<User> currentSpec = UserSpecification.methodEqual(methodStringV);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (userCriteria.getIsUsing() != null && userCriteria.getIsUsing().isPresent()) {
            String statusString = userCriteria.getIsUsing().get();
            Boolean isUsingBoolean = false;
            for (UserIsUsingEnum isUsing : UserIsUsingEnum.values()) {
                if (isUsing.getDescription().equals(statusString)) {
                    isUsingBoolean = isUsing.getValue();
                    break;
                }
            }
            System.out.println(isUsingBoolean);
            Specification<User> currentSpec = UserSpecification.isUsingEqual(isUsingBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        if (userCriteria.getStatus() != null && userCriteria.getStatus().isPresent()) {
            String statusString = userCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<User> currentSpec = UserSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.userRepository.findAll(combinedSpec, sort);
    }

    public User upsert(User user) {
        return this.userRepository.save(user);
    }

    public void deleteById(Integer id) {
        this.userRepository.deleteById(id);
    }

    public void lock(User userLocked) {
        this.userRepository.save(userLocked);
    }

    public void changeRefreshToken(String username, String refreshToken) {
        User userChange = getOneByUsername(username);
        if (userChange != null) {
            userChange.setRefreshToken(refreshToken);
            upsert(userChange);
        }
    }
}
