package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.SalaryAdvanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.SalaryAdvanceDTO;
import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance;
import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance_;
import vn.tuhoc.vinaeatery.domain.enumm.SalaryAdvanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.SalaryAdvanceRepository;
import vn.tuhoc.vinaeatery.service.specification.SalaryAdvanceSpecification;

@Service
@RequiredArgsConstructor
public class SalaryAdvanceService {
    // Properties
    private final EmployeeService employeeService;
    private final SalaryAdvanceRepository salaryAdvanceRepository;

    // Methods
    public SalaryAdvance getOneById(Integer id) {
        return this.salaryAdvanceRepository.findOneById(id);
    }

    public SalaryAdvanceDTO getOneFormatById(Integer id) {
        SalaryAdvanceDTO salaryAdvanceDTO = new SalaryAdvanceDTO();
        SalaryAdvance salaryAdvance = this.salaryAdvanceRepository.findOneById(id);
        if (salaryAdvance != null) {
            salaryAdvanceDTO.setId(salaryAdvance.getId());
            salaryAdvanceDTO.setRestaurantId(salaryAdvance.getRestaurantId());
            salaryAdvanceDTO.setCreateAt(salaryAdvance.getCreateAt());
            if (salaryAdvance.getEmployeeHandleId() != null) {
                salaryAdvanceDTO
                        .setEmployeeHandle(employeeService.getOneFormatById(salaryAdvance.getEmployeeHandleId()));
            }
            if (salaryAdvance.getEmployeeMainId() != null) {
                salaryAdvanceDTO
                        .setEmployeeMain(employeeService.getOneFormatById(salaryAdvance.getEmployeeMainId()));
            }
            salaryAdvanceDTO.setDate(salaryAdvance.getDate());
            salaryAdvanceDTO.setMoney(salaryAdvance.getMoney());
            salaryAdvanceDTO.setReason(salaryAdvance.getReason());
            salaryAdvanceDTO.setStatus(salaryAdvance.getStatus());
        }

        return salaryAdvanceDTO;
    }

    public List<SalaryAdvance> getAll() {
        return this.salaryAdvanceRepository.findAll();
    }

    public List<SalaryAdvance> getAll(SalaryAdvanceCriteria salaryAdvanceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (salaryAdvanceCriteria.getSort() != null && salaryAdvanceCriteria.getSort().isPresent()) {
            String sortStr = salaryAdvanceCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(SalaryAdvance_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(SalaryAdvance_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(SalaryAdvance_.CREATE_AT).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(SalaryAdvance_.CREATE_AT).descending();
            }
        }

        //
        if (salaryAdvanceCriteria.getId() == null
                && salaryAdvanceCriteria.getRestaurantId() == null
                && salaryAdvanceCriteria.getCreateAtStart() == null
                && salaryAdvanceCriteria.getCreateAtEnd() == null
                && salaryAdvanceCriteria.getEmployeeHandleId() == null
                && salaryAdvanceCriteria.getEmployeeMainId() == null
                && salaryAdvanceCriteria.getDate() == null
                && salaryAdvanceCriteria.getStatus() == null
                && salaryAdvanceCriteria.getSort() == null) {
            return this.salaryAdvanceRepository.findAll();
        }

        //
        Specification<SalaryAdvance> combinedSpec = Specification.where(null);
        if (salaryAdvanceCriteria.getId() != null && salaryAdvanceCriteria.getId().isPresent()) {
            if (salaryAdvanceCriteria.getId().get().matches("\\d+")) {
                Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                        .idEqual(salaryAdvanceCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (salaryAdvanceCriteria.getRestaurantId() != null
                && salaryAdvanceCriteria.getRestaurantId().isPresent()) {
            if (salaryAdvanceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                        .restaurantIdEqual(salaryAdvanceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (salaryAdvanceCriteria.getCreateAtStart() != null
                && salaryAdvanceCriteria.getCreateAtStart().isPresent()) {
            Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                    .createAtAfter(salaryAdvanceCriteria.getCreateAtStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (salaryAdvanceCriteria.getCreateAtEnd() != null
                && salaryAdvanceCriteria.getCreateAtEnd().isPresent()) {
            Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                    .createAtBefore(salaryAdvanceCriteria.getCreateAtEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (salaryAdvanceCriteria.getEmployeeHandleId() != null
                && salaryAdvanceCriteria.getEmployeeHandleId().isPresent()) {
            if (salaryAdvanceCriteria.getEmployeeHandleId().get().matches("\\d+")) {
                Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                        .employeeHandleIdEqual(salaryAdvanceCriteria.getEmployeeHandleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (salaryAdvanceCriteria.getEmployeeMainId() != null
                && salaryAdvanceCriteria.getEmployeeMainId().isPresent()) {
            if (salaryAdvanceCriteria.getEmployeeMainId().get().matches("\\d+")) {
                Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification
                        .employeeMainIdEqual(salaryAdvanceCriteria.getEmployeeMainId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (salaryAdvanceCriteria.getStatus() != null && salaryAdvanceCriteria.getStatus().isPresent()) {
            String statusString = salaryAdvanceCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (SalaryAdvanceStatusEnum SalaryAdvanceStatus : SalaryAdvanceStatusEnum.values()) {
                if (SalaryAdvanceStatus.getDescription().equals(statusString)) {
                    statusInteger = SalaryAdvanceStatus.getValue();
                    break;
                }
            }
            Specification<SalaryAdvance> currentSpec = SalaryAdvanceSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.salaryAdvanceRepository.findAll(combinedSpec, sort);
    }

    public List<SalaryAdvanceDTO> getAllFormat(SalaryAdvanceCriteria SalaryAdvanceCriteria) {
        List<SalaryAdvanceDTO> listFormat = new ArrayList<>();
        for (SalaryAdvance salaryAdvance : getAll(SalaryAdvanceCriteria)) {
            listFormat.add(getOneFormatById(salaryAdvance.getId()));
        }

        return listFormat;
    }

    public SalaryAdvance upsert(SalaryAdvance SalaryAdvance) {
        return this.salaryAdvanceRepository.save(SalaryAdvance);
    }
}