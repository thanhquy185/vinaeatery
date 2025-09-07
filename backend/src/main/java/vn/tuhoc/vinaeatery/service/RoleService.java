package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Role;
import vn.tuhoc.vinaeatery.domain.RoleDetail;
import vn.tuhoc.vinaeatery.domain.Role_;
import vn.tuhoc.vinaeatery.domain.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RoleDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleDetailDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.RoleDetailRepository;
import vn.tuhoc.vinaeatery.repository.RoleRepository;
import vn.tuhoc.vinaeatery.service.specification.RoleSpecification;

@Service
@RequiredArgsConstructor
public class RoleService {
    // Properties
    private final RoleRepository roleRepository;
    private final RoleDetailRepository roleDetailRepository;

    // Methods
    public Role getOneById(Integer id) {
        return this.roleRepository.findOneById(id);
    }

    public RoleDTO getOneFormatById(Integer id) {
        RoleDTO roleDTO = new RoleDTO();
        Role role = roleRepository.findOneById(id);
        if (role != null) {
            List<RoleDetailDTO> listRoleDetail = new ArrayList<>();
            for (RoleDetail roleDetail : roleDetailRepository.findAllByRoleId(role.getId())) {
                listRoleDetail.add(new RoleDetailDTO(roleDetail.getId().getRoleId(), roleDetail.getId().getFunctionId(),
                        roleDetail.getId().getAction()));
            }

            roleDTO.setId(role.getId());
            roleDTO.setName(role.getName());
            roleDTO.setSalary(role.getSalary());
            roleDTO.setStatus(role.getStatus());
            roleDTO.setTimeUpdate(role.getTimeUpdate());
            roleDTO.setRoleDetails(listRoleDetail);
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
        if (roleCriteria.getId() == null && roleCriteria.getName() == null
                && roleCriteria.getSort() == null && roleCriteria.getStatus() == null) {
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
            List<RoleDetailDTO> listRoleDetail = new ArrayList<>();
            for (RoleDetail roleDetail : roleDetailRepository.findAllByRoleId(role.getId())) {
                listRoleDetail.add(new RoleDetailDTO(roleDetail.getId().getRoleId(), roleDetail.getId().getFunctionId(),
                        roleDetail.getId().getAction()));
            }

            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setId(role.getId());
            roleDTO.setName(role.getName());
            roleDTO.setSalary(role.getSalary());
            roleDTO.setStatus(role.getStatus());
            roleDTO.setTimeUpdate(role.getTimeUpdate());
            roleDTO.setRoleDetails(listRoleDetail);

            listFormat.add(roleDTO);
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