package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ManagerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ManagerDTO;
import vn.tuhoc.vinaeatery.domain.entity.Manager_;
import vn.tuhoc.vinaeatery.domain.entity.Manager;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.ManagerRepository;
import vn.tuhoc.vinaeatery.service.specification.ManagerSpecification;

@Service
@RequiredArgsConstructor
public class ManagerService {
    // Properties
    private final UserService userService;
    private final ManagerRepository managerRepository;

    // Methods
    public Manager getOneById(Integer id) {
        return this.managerRepository.findOneById(id);
    }

    public ManagerDTO getOneByUserId(Integer userid) {
        return getOneFormatById(this.managerRepository.findOneByUserId(userid).getId());
    }

    public ManagerDTO getOneFormatById(Integer id) {
        ManagerDTO managerDTO = new ManagerDTO();
        Manager manager = getOneById(id);
        if (manager != null) {
            managerDTO.setId(manager.getId());
            if (manager.getUserId() != null) {
                managerDTO.setUser(userService.getOneById(manager.getUserId()));
            }
            managerDTO.setCreateAt(manager.getCreateAt());
            managerDTO.setImage(manager.getImage());
            managerDTO.setFullname(manager.getFullname());
            managerDTO.setBirthday(manager.getBirthday());
            managerDTO.setGender(manager.getGender());
            managerDTO.setPhone(manager.getPhone());
            managerDTO.setEmail(manager.getEmail());
            managerDTO.setAddress(manager.getAddress());
            managerDTO.setDescription(manager.getDescription());
            managerDTO.setStatus(manager.getStatus());
            managerDTO.setUpdateAt(manager.getUpdateAt());
        }

        return managerDTO;
    }

    public List<Manager> getAll() {
        return this.managerRepository.findAll();
    }

    public List<Manager> getAll(ManagerCriteria managerCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (managerCriteria.getSort() != null && managerCriteria.getSort().isPresent()) {
            String sortStr = managerCriteria.getSort().get();
            switch (sortStr) {
                case "Mã khách hàng tăng dần" -> sort = Sort.by(Manager_.ID).ascending();
                case "Mã khách hàng giảm dần" -> sort = Sort.by(Manager_.ID).descending();
                case "Họ tên chủ nhà hàng tăng dần" -> sort = Sort.by(Manager_.FULLNAME).ascending();
                case "Họ tên chủ nhà hàng giảm dần" -> sort = Sort.by(Manager_.FULLNAME).descending();
            }
        }

        //
        if (managerCriteria.getId() == null && managerCriteria.getFullname() == null
                && managerCriteria.getPhone() == null
                && managerCriteria.getEmail() == null
                && managerCriteria.getStatus() == null
                && managerCriteria.getSort() == null) {
            return this.managerRepository.findAll(sort);
        }
        //
        Specification<Manager> combinedSpec = Specification.where(null);
        if (managerCriteria.getId() != null && managerCriteria.getId().isPresent()) {
            if (managerCriteria.getId().get().matches("\\d+")) {
                Specification<Manager> currentSpec = ManagerSpecification.idEqual(managerCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (managerCriteria.getFullname() != null && managerCriteria.getFullname().isPresent()) {
            Specification<Manager> currentSpec = ManagerSpecification
                    .fullnameLike(managerCriteria.getFullname().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (managerCriteria.getPhone() != null && managerCriteria.getPhone().isPresent()) {
            if (managerCriteria.getPhone().get().matches("\\d+")) {
                Specification<Manager> currentSpec = ManagerSpecification
                        .phoneLike(managerCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (managerCriteria.getEmail() != null && managerCriteria.getEmail().isPresent()) {
            Specification<Manager> currentSpec = ManagerSpecification.emailLike(managerCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (managerCriteria.getStatus() != null && managerCriteria.getStatus().isPresent()) {
            String statusString = managerCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Manager> currentSpec = ManagerSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.managerRepository.findAll(combinedSpec, sort);
    }

    public List<ManagerDTO> getAllFormat(ManagerCriteria ManagerCriteria) {
        List<ManagerDTO> listFormat = new ArrayList<>();
        for (Manager Manager : getAll(ManagerCriteria)) {
            listFormat.add(getOneFormatById(Manager.getId()));
        }

        return listFormat;
    }

    public Manager upsert(Manager Manager) {
        return this.managerRepository.save(Manager);
    }

    public void delete(Integer id) {
        this.managerRepository.deleteById(id);
    }

    public void lock(Manager Manager) {
        this.managerRepository.save(Manager);
    }
}