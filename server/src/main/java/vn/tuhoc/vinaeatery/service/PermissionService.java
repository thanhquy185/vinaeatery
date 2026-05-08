package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.domain.dto.PermissionDTO;
import vn.tuhoc.vinaeatery.domain.dto.PermissionDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.Permission;
import vn.tuhoc.vinaeatery.domain.entity.Permission_;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.PermissionDetailRepository;
import vn.tuhoc.vinaeatery.repository.PermissionRepository;
import vn.tuhoc.vinaeatery.service.specification.PermissionSpecification;

@Service
@RequiredArgsConstructor
public class PermissionService {
    // Properties
    private final PermissionRepository permissionRepository;
    private final PermissionDetailRepository permissionDetailRepository;

    // Methods
    public Permission getOneById(Integer id) {
        return this.permissionRepository.findOneById(id);
    }

    public PermissionDTO getOneFormatById(Integer id) {
        PermissionDTO permissionDTO = new PermissionDTO();
        Permission permission = this.permissionRepository.findOneById(id);
        if (permission != null) {
            List<PermissionDetailDTO> listPermissionDetail = new ArrayList<>();
            for (PermissionDetail permissionDetail : this.permissionDetailRepository
                    .findAllByPermissionId(permission.getId())) {
                listPermissionDetail.add(new PermissionDetailDTO(permissionDetail.getId().getPermissionId(),
                        permissionDetail.getId().getFunctionId(),
                        permissionDetail.getId().getAction()));
            }

            permissionDTO.setId(permission.getId());
            permissionDTO.setRestaurantId(permission.getRestaurantId());
            permissionDTO.setName(permission.getName());
            permissionDTO.setStatus(permission.getStatus());
            permissionDTO.setPermissionDetails(listPermissionDetail);
        }

        return permissionDTO;
    }

    public List<Permission> getAll() {
        return this.permissionRepository.findAll();
    }

    public List<Permission> getAll(PermissionCriteria permissionCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (permissionCriteria.getSort() != null && permissionCriteria.getSort().isPresent()) {
            String sortStr = permissionCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Permission_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Permission_.ID).descending();
                case "Tên tăng dần" -> sort = Sort.by(Permission_.NAME).ascending();
                case "Tên giảm dần" -> sort = Sort.by(Permission_.NAME).descending();
            }
        }

        //
        if (permissionCriteria.getId() == null
                && permissionCriteria.getRestaurantId() == null
                && permissionCriteria.getName() == null
                && permissionCriteria.getSort() == null
                && permissionCriteria.getStatus() == null) {
            return this.permissionRepository.findAll(sort);
        }
        //
        Specification<Permission> combinedSpec = Specification.where(null);
        if (permissionCriteria.getId() != null && permissionCriteria.getId().isPresent()) {
            if (permissionCriteria.getId().get().matches("\\d+")) {
                Specification<Permission> currentSpec = PermissionSpecification
                        .idEqual(permissionCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (permissionCriteria.getRestaurantId() != null && permissionCriteria.getRestaurantId().isPresent()) {
            if (permissionCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Permission> currentSpec = PermissionSpecification
                        .restaurantIdEqual(permissionCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionCriteria.getName() != null && permissionCriteria.getName().isPresent()) {
            Specification<Permission> currentSpec = PermissionSpecification
                    .nameLike(permissionCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (permissionCriteria.getStatus() != null && permissionCriteria.getStatus().isPresent()) {
            String statusString = permissionCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Permission> currentSpec = PermissionSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.permissionRepository.findAll(combinedSpec, sort);
    }

    public List<PermissionDTO> getAllFormat(PermissionCriteria permissionCriteria) {
        List<PermissionDTO> listFormat = new ArrayList<>();
        for (Permission permission : getAll(permissionCriteria)) {
            listFormat.add(getOneFormatById(permission.getId()));
        }

        return listFormat;
    }

    public Permission upsert(Permission permission) {
        return this.permissionRepository.save(permission);
    }

    public void deleteById(Integer id) {
        this.permissionRepository.deleteById(id);
    }

    public void lock(Permission permission) {
        this.permissionRepository.save(permission);
    }
}