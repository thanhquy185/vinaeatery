package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.RoleHistory;
import vn.tuhoc.vinaeatery.domain.criteria.RoleHistoryCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RoleHistoryDTO;
import vn.tuhoc.vinaeatery.repository.RoleHistoryRepository;
import vn.tuhoc.vinaeatery.repository.RoleRepository;
import vn.tuhoc.vinaeatery.service.specification.RoleHistorySpecification;

@Service
@AllArgsConstructor
public class RoleHistoryService {
    // Properties
    private final RoleHistoryRepository roleHistoryRepository;
    private final RoleRepository roleRepository;

    // Methods
    public RoleHistory getNewByEmployeeId(Integer employeeId) {
        return this.roleHistoryRepository.findNewByEmployeeId(employeeId);
    }

    public List<RoleHistory> getAll(RoleHistoryCriteria roleHistoryCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (roleHistoryCriteria.getSort() != null && roleHistoryCriteria.getSort().isPresent()) {
            String sortStr = roleHistoryCriteria.getSort().get();
            switch (sortStr) {
                case "Mã nhân viên tăng dần" -> sort = Sort.by("id.employeeId").ascending();
                case "Mã nhân viên giảm dần" -> sort = Sort.by("id.employeeId").descending();
                case "Mã nhóm quyền tăng dần" -> sort = Sort.by("id.roleId").ascending();
                case "Mã nhóm quyền giảm dần" -> sort = Sort.by("id.roleId").descending();
                case "Ngày bắt đầu tăng dần" -> sort = Sort.by("id.dateBegin").ascending();
                case "Ngày bắt đầu giảm dần" -> sort = Sort.by("id.dateBegin").descending();
            }
        }

        //
        if (roleHistoryCriteria.getRoleId() == null && roleHistoryCriteria.getEmployeeId() == null
                && roleHistoryCriteria.getSort() == null && roleHistoryCriteria.getDateBegin() == null) {
            return this.roleHistoryRepository.findAll(sort);
        }
        //
        Specification<RoleHistory> combinedSpec = Specification.where(null);
        if (roleHistoryCriteria.getEmployeeId() != null && roleHistoryCriteria.getEmployeeId().isPresent()) {
            if (roleHistoryCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<RoleHistory> currentSpec = RoleHistorySpecification
                        .employeeIdEqual(roleHistoryCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (roleHistoryCriteria.getRoleId() != null && roleHistoryCriteria.getRoleId().isPresent()) {
            if (roleHistoryCriteria.getRoleId().get().matches("\\d+")) {
                Specification<RoleHistory> currentSpec = RoleHistorySpecification
                        .roleIdEqual(roleHistoryCriteria.getRoleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (roleHistoryCriteria.getDateBegin() != null && roleHistoryCriteria.getDateBegin().isPresent()) {
            Specification<RoleHistory> currentSpec = RoleHistorySpecification
                    .dateBeginEqual(roleHistoryCriteria.getDateBegin().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.roleHistoryRepository.findAll(combinedSpec, sort);
    }

    public List<RoleHistoryDTO> getAllFormat(RoleHistoryCriteria roleHistoryCriteria) {
        List<RoleHistoryDTO> listRoleHistoryFormat = new ArrayList<>();
        for (RoleHistory roleHistory : getAll(roleHistoryCriteria)) {
            listRoleHistoryFormat
                    .add(new RoleHistoryDTO(roleHistory.getId().getEmployeeId(), roleHistory.getId().getRoleId(),
                            roleRepository.findOneById(roleHistory.getId().getRoleId()).getName(),
                            roleHistory.getId().getDateBegin(), roleHistory.getDateEnd()));
        }

        return listRoleHistoryFormat;
    }

    public List<RoleHistory> getAllByEmployeeId(Integer employeeId) {
        return this.roleHistoryRepository.findAllByEmployeeId(employeeId);
    }

    public List<RoleHistory> getAllByRoleId(Integer roleId) {
        return this.roleHistoryRepository.findAllNewByRoleId(roleId);
    }

    public RoleHistory upsert(RoleHistory roleHistory) {
        return this.roleHistoryRepository.save(roleHistory);
    }
}