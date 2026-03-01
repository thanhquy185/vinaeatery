package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.PermissionTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.PermissionTicketDTO;
import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;
import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket_;
import vn.tuhoc.vinaeatery.domain.enumm.PermissionTicketStatusEnum;
import vn.tuhoc.vinaeatery.repository.PermissionTicketRepository;
import vn.tuhoc.vinaeatery.service.specification.PermissionTicketSpecification;

@Service
@RequiredArgsConstructor
public class PermissionTicketService {
    // Properties
    private final CategoryPermissionTicketService categoryPermissionTicketService;
    private final EmployeeService employeeService;
    private final PermissionTicketRepository permissionTicketRepository;

    // Methods
    public PermissionTicket getOneById(Integer id) {
        return this.permissionTicketRepository.findOneById(id);
    }

    public PermissionTicketDTO getOneFormatById(Integer id) {
        PermissionTicketDTO permissionTicketDTO = new PermissionTicketDTO();
        PermissionTicket permissionTicket = this.permissionTicketRepository.findOneById(id);
        if (permissionTicket != null) {
            permissionTicketDTO.setId(permissionTicket.getId());
            permissionTicketDTO.setRestaurantId(permissionTicket.getRestaurantId());
            permissionTicketDTO.setCreateAt(permissionTicket.getCreateAt());
            if (permissionTicket.getEmployeeHandleId() != null) {
                permissionTicketDTO
                        .setEmployeeHandle(employeeService.getOneFormatById(permissionTicket.getEmployeeHandleId()));
            }
            if (permissionTicket.getEmployeeMainId() != null) {
                permissionTicketDTO
                        .setEmployeeMain(employeeService.getOneFormatById(permissionTicket.getEmployeeMainId()));
            }
            if (permissionTicket.getCategoryPermissionTicketId() != null) {
                permissionTicketDTO
                        .setCategoryPermissionTicket(categoryPermissionTicketService
                                .getOneById(permissionTicket.getCategoryPermissionTicketId()));
            }
            permissionTicketDTO.setDate(permissionTicket.getDate());
            permissionTicketDTO.setReason(permissionTicket.getReason());
            permissionTicketDTO.setStatus(permissionTicket.getStatus());
        }

        return permissionTicketDTO;
    }

    public List<PermissionTicket> getAll() {
        return this.permissionTicketRepository.findAll();
    }

    public List<PermissionTicket> getAll(PermissionTicketCriteria permissionTicketCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (permissionTicketCriteria.getSort() != null && permissionTicketCriteria.getSort().isPresent()) {
            String sortStr = permissionTicketCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(PermissionTicket_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(PermissionTicket_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(PermissionTicket_.CREATE_AT).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(PermissionTicket_.CREATE_AT).descending();
            }
        }

        //
        if (permissionTicketCriteria.getId() == null
                && permissionTicketCriteria.getRestaurantId() == null
                && permissionTicketCriteria.getCreateAtStart() == null
                && permissionTicketCriteria.getCreateAtEnd() == null
                && permissionTicketCriteria.getEmployeeHandleId() == null
                && permissionTicketCriteria.getEmployeeMainId() == null
                && permissionTicketCriteria.getCategoryPermissionTicketId() == null
                && permissionTicketCriteria.getDate() == null
                && permissionTicketCriteria.getStatus() == null
                && permissionTicketCriteria.getSort() == null) {
            return this.permissionTicketRepository.findAll();
        }

        //
        Specification<PermissionTicket> combinedSpec = Specification.where(null);
        if (permissionTicketCriteria.getId() != null && permissionTicketCriteria.getId().isPresent()) {
            if (permissionTicketCriteria.getId().get().matches("\\d+")) {
                Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                        .idEqual(permissionTicketCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionTicketCriteria.getRestaurantId() != null
                && permissionTicketCriteria.getRestaurantId().isPresent()) {
            if (permissionTicketCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                        .restaurantIdEqual(permissionTicketCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionTicketCriteria.getCreateAtStart() != null
                && permissionTicketCriteria.getCreateAtStart().isPresent()) {
            Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                    .createAtAfter(permissionTicketCriteria.getCreateAtStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (permissionTicketCriteria.getCreateAtEnd() != null
                && permissionTicketCriteria.getCreateAtEnd().isPresent()) {
            Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                    .createAtBefore(permissionTicketCriteria.getCreateAtEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (permissionTicketCriteria.getEmployeeHandleId() != null
                && permissionTicketCriteria.getEmployeeHandleId().isPresent()) {
            if (permissionTicketCriteria.getEmployeeHandleId().get().matches("\\d+")) {
                Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                        .employeeHandleIdEqual(permissionTicketCriteria.getEmployeeHandleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionTicketCriteria.getEmployeeMainId() != null
                && permissionTicketCriteria.getEmployeeMainId().isPresent()) {
            if (permissionTicketCriteria.getEmployeeMainId().get().matches("\\d+")) {
                Specification<PermissionTicket> currentSpec = PermissionTicketSpecification
                        .employeeMainIdEqual(permissionTicketCriteria.getEmployeeMainId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (permissionTicketCriteria.getStatus() != null && permissionTicketCriteria.getStatus().isPresent()) {
            String statusString = permissionTicketCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (PermissionTicketStatusEnum PermissionTicketStatus : PermissionTicketStatusEnum.values()) {
                if (PermissionTicketStatus.getDescription().equals(statusString)) {
                    statusInteger = PermissionTicketStatus.getValue();
                    break;
                }
            }
            Specification<PermissionTicket> currentSpec = PermissionTicketSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.permissionTicketRepository.findAll(combinedSpec, sort);
    }

    public List<PermissionTicketDTO> getAllFormat(PermissionTicketCriteria permissionTicketCriteria) {
        List<PermissionTicketDTO> listFormat = new ArrayList<>();
        for (PermissionTicket permissionTicket : getAll(permissionTicketCriteria)) {
            listFormat.add(getOneFormatById(permissionTicket.getId()));
        }

        return listFormat;
    }

    public List<PermissionTicket> getAllByCategoryPermissionTicketId(Integer categoryPermissionTicketId) {
        return this.permissionTicketRepository.findAllByCategoryPermissionTicketId(categoryPermissionTicketId);
    }

    public PermissionTicket upsert(PermissionTicket permissionTicket) {
        return this.permissionTicketRepository.save(permissionTicket);
    }
}