package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RoleDTO;
import vn.tuhoc.vinaeatery.domain.entity.Role;
import vn.tuhoc.vinaeatery.domain.entity.Role_;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.RoleRepository;
import vn.tuhoc.vinaeatery.service.specification.RoleSpecification;

@Service
@RequiredArgsConstructor
public class RoleService {
    // Properties
    private final RoleRepository roleRepository;

    // Methods
    public Role getOneById(Integer id) {
        return this.roleRepository.findOneById(id);
    }

    public RoleDTO getOneFormatById(Integer id) {
        RoleDTO roleDTO = new RoleDTO();
        Role role = roleRepository.findOneById(id);
        if (role != null) {
            roleDTO.setId(role.getId());
            roleDTO.setRestaurantId(role.getRestaurantId());
            roleDTO.setName(role.getName());
            roleDTO.setSalaryType(role.getSalaryType());
            roleDTO.setSalaryValue(role.getSalaryValue());
            roleDTO.setStatus(role.getStatus());
            roleDTO.setUpdateAt(role.getUpdateAt());
        }

        return roleDTO;
    }

    public List<Role> getAll() {
        return this.roleRepository.findAll();
    }

    public List<Role> getAll(RoleCriteria roleCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (roleCriteria.getSort() != null && roleCriteria.getSort().isPresent()) {
            String sortStr = roleCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Role_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Role_.ID).descending();
                case "Tên tăng dần" -> sort = Sort.by(Role_.NAME).ascending();
                case "Tên giảm dần" -> sort = Sort.by(Role_.NAME).descending();
            }
        }

        //
        if (roleCriteria.getId() == null
                && roleCriteria.getRestaurantId() == null
                && roleCriteria.getName() == null
                && roleCriteria.getSort() == null
                && roleCriteria.getStatus() == null) {
            return this.roleRepository.findAll(sort);
        }
        //
        Specification<Role> combinedSpec = Specification.where(null);
        if (roleCriteria.getId() != null && roleCriteria.getId().isPresent()) {
            if (roleCriteria.getId().get().matches("\\d+")) {
                Specification<Role> currentSpec = RoleSpecification.idEqual(roleCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (roleCriteria.getRestaurantId() != null && roleCriteria.getRestaurantId().isPresent()) {
            if (roleCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Role> currentSpec = RoleSpecification
                        .restaurantIdEqual(roleCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (roleCriteria.getName() != null && roleCriteria.getName().isPresent()) {
            Specification<Role> currentSpec = RoleSpecification.nameLike(roleCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (roleCriteria.getStatus() != null && roleCriteria.getStatus().isPresent()) {
            String statusString = roleCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Role> currentSpec = RoleSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.roleRepository.findAll(combinedSpec, sort);
    }

    public List<RoleDTO> getAllFormat(RoleCriteria roleCriteria) {
        List<RoleDTO> listFormat = new ArrayList<>();
        for (Role role : getAll(roleCriteria)) {
            listFormat.add(getOneFormatById(role.getId()));
        }

        return listFormat;
    }

    public Role upsert(Role Role) {
        return this.roleRepository.save(Role);
    }

    public void deleteById(Integer id) {
        this.roleRepository.deleteById(id);
    }

    public void lock(Role role) {
        this.roleRepository.save(role);
    }
}