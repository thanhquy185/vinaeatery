package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.PermissionDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.PermissionDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
import vn.tuhoc.vinaeatery.repository.PermissionDetailRepository;
import vn.tuhoc.vinaeatery.service.specification.PermissionDetailSpecification;

@Service
@RequiredArgsConstructor
public class PermissionDetailService {
    // Properties
    private final PermissionDetailRepository permissionDetailRepository;

    // Methods
    public List<PermissionDetail> getAll(PermissionDetailCriteria permissionDetailCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (permissionDetailCriteria.getSort() != null && permissionDetailCriteria.getSort().isPresent()) {
            String sortStr = permissionDetailCriteria.getSort().get();
            switch (sortStr) {
                case "Mã nhóm quyền tăng dần" -> sort = Sort.by("id.permissionId").ascending();
                case "Mã nhóm quyền giảm dần" -> sort = Sort.by("id.permissionId").descending();
                case "Mã chức năng tăng dần" -> sort = Sort.by("id.functionId").ascending();
                case "Mã chức năng giảm dần" -> sort = Sort.by("id.functionId").descending();
                case "Hành động tăng dần" -> sort = Sort.by("id.action").ascending();
                case "Hành động giảm dần" -> sort = Sort.by("id.action").descending();
            }
        }

        //
        if (permissionDetailCriteria.getPermissionId() == null && permissionDetailCriteria.getFunctionId() == null
                && permissionDetailCriteria.getSort() == null && permissionDetailCriteria.getAction() == null) {
            return this.permissionDetailRepository.findAll(sort);
        }
        //
        Specification<PermissionDetail> combinedSpec = Specification.where(null);
        if (permissionDetailCriteria.getPermissionId() != null
                && permissionDetailCriteria.getPermissionId().isPresent()) {
            if (permissionDetailCriteria.getPermissionId().get().matches("\\d+")) {
                Specification<PermissionDetail> currentSpec = PermissionDetailSpecification
                        .permissionIdEqual(permissionDetailCriteria.getPermissionId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionDetailCriteria.getFunctionId() != null && permissionDetailCriteria.getFunctionId().isPresent()) {
            if (permissionDetailCriteria.getFunctionId().get().matches("\\d+")) {
                Specification<PermissionDetail> currentSpec = PermissionDetailSpecification
                        .functionIdEqual(permissionDetailCriteria.getFunctionId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionDetailCriteria.getAction() != null && permissionDetailCriteria.getAction().isPresent()) {
            Specification<PermissionDetail> currentSpec = PermissionDetailSpecification
                    .actionEqual(permissionDetailCriteria.getAction().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.permissionDetailRepository.findAll(combinedSpec, sort);
    }

    public List<PermissionDetailDTO> getAllFormat(PermissionDetailCriteria permissionDetailCriteria) {
        List<PermissionDetailDTO> listPermissionDetailFormat = new ArrayList<>();
        for (PermissionDetail permissionDetail : getAll(permissionDetailCriteria)) {
            listPermissionDetailFormat.add(new PermissionDetailDTO(permissionDetail.getId().getPermissionId(),
                    permissionDetail.getId().getFunctionId(), permissionDetail.getId().getAction()));
        }

        return listPermissionDetailFormat;
    }

    public List<PermissionDetail> getAllByPermissionId(Integer permissionId) {
        return this.permissionDetailRepository.findAllByPermissionId(permissionId);
    }

    public PermissionDetail upsert(PermissionDetail permissionDetail) {
        return this.permissionDetailRepository.save(permissionDetail);
    }

    public void clearAllByPermissionId(Integer permissionId) {
        this.permissionDetailRepository.deleteAllByPermissionId(permissionId);
    }
}