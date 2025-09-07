package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.RoleDetail;
import vn.tuhoc.vinaeatery.domain.criteria.RoleDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RoleDetailDTO;
import vn.tuhoc.vinaeatery.repository.RoleDetailRepository;
import vn.tuhoc.vinaeatery.service.specification.RoleDetailSpecification;

@Service
@RequiredArgsConstructor
public class RoleDetailService {
    // Properties
    private final RoleDetailRepository roleDetailRepository;

    // Methods
    public List<RoleDetail> getAll(RoleDetailCriteria roleDetailCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (roleDetailCriteria.getSort() != null && roleDetailCriteria.getSort().isPresent()) {
            String sortStr = roleDetailCriteria.getSort().get();
            switch (sortStr) {
                case "Mã nhóm quyền tăng dần" -> sort = Sort.by("id.roleId").ascending();
                case "Mã nhóm quyền giảm dần" -> sort = Sort.by("id.roleId").descending();
                case "Mã chức năng tăng dần" -> sort = Sort.by("id.functionId").ascending();
                case "Mã chức năng giảm dần" -> sort = Sort.by("id.functionId").descending();
                case "Hành động tăng dần" -> sort = Sort.by("id.action").ascending();
                case "Hành động giảm dần" -> sort = Sort.by("id.action").descending();
            }
        }

        //
        if (roleDetailCriteria.getRoleId() == null && roleDetailCriteria.getFunctionId() == null
                && roleDetailCriteria.getSort() == null && roleDetailCriteria.getAction() == null) {
            return this.roleDetailRepository.findAll(sort);
        }
        //
        Specification<RoleDetail> combinedSpec = Specification.where(null);
        if (roleDetailCriteria.getRoleId() != null && roleDetailCriteria.getRoleId().isPresent()) {
            if (roleDetailCriteria.getRoleId().get().matches("\\d+")) {
                Specification<RoleDetail> currentSpec = RoleDetailSpecification
                        .roleIdEqual(roleDetailCriteria.getRoleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (roleDetailCriteria.getFunctionId() != null && roleDetailCriteria.getFunctionId().isPresent()) {
            if (roleDetailCriteria.getFunctionId().get().matches("\\d+")) {
                Specification<RoleDetail> currentSpec = RoleDetailSpecification
                        .functionIdEqual(roleDetailCriteria.getFunctionId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (roleDetailCriteria.getAction() != null && roleDetailCriteria.getAction().isPresent()) {
            Specification<RoleDetail> currentSpec = RoleDetailSpecification
                    .actionEqual(roleDetailCriteria.getAction().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.roleDetailRepository.findAll(combinedSpec, sort);
    }

    public List<RoleDetailDTO> getAllFormat(RoleDetailCriteria roleDetailCriteria) {
        List<RoleDetailDTO> listRoleDetailFormat = new ArrayList<>();
        for (RoleDetail roleDetail : getAll(roleDetailCriteria)) {
            listRoleDetailFormat.add(new RoleDetailDTO(roleDetail.getId().getRoleId(),
                    roleDetail.getId().getFunctionId(), roleDetail.getId().getAction()));
        }

        return listRoleDetailFormat;
    }

    public List<RoleDetail> getAllByRoleId(Integer roleId) {
        return this.roleDetailRepository.findAllByRoleId(roleId);
    }

    public RoleDetail upsert(RoleDetail roleDetail) {
        return this.roleDetailRepository.save(roleDetail);
    }

    public void clearAllByRoleId(Integer roleId) {
        this.roleDetailRepository.deleteAllByRoleId(roleId);
    }
}