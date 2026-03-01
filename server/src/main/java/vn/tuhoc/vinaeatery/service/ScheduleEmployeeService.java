package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ScheduleEmployeeCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleEmployeeDTO;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee;
import vn.tuhoc.vinaeatery.repository.ScheduleEmployeeRepository;
import vn.tuhoc.vinaeatery.service.specification.ScheduleEmployeeSpecification;

@Service
@RequiredArgsConstructor
public class ScheduleEmployeeService {
    // Properties
    private final ScheduleEmployeeRepository scheduleEmployeeRepository;

    // Methods
    public List<ScheduleEmployee> getAll(ScheduleEmployeeCriteria scheduleEmployeeCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (scheduleEmployeeCriteria.getSort() != null && scheduleEmployeeCriteria.getSort().isPresent()) {
            String sortStr = scheduleEmployeeCriteria.getSort().get();
            switch (sortStr) {
                case "Mã lịch làm tăng dần" -> sort = Sort.by("id.scheduleId").ascending();
                case "Mã lịch làm giảm dần" -> sort = Sort.by("id.scheduleId").descending();
                case "Mã nhân viên tăng dần" -> sort = Sort.by("id.employeeId").ascending();
                case "Mã nhân viên giảm dần" -> sort = Sort.by("id.employeeId").descending();
            }
        }

        //
        if (scheduleEmployeeCriteria.getScheduleId() == null
                && scheduleEmployeeCriteria.getEmployeeId() == null
                && scheduleEmployeeCriteria.getSort() == null) {
            return this.scheduleEmployeeRepository.findAll(sort);
        }
        //
        Specification<ScheduleEmployee> combinedSpec = Specification.where(null);
        if (scheduleEmployeeCriteria.getScheduleId() != null
                && scheduleEmployeeCriteria.getScheduleId().isPresent()) {
            if (scheduleEmployeeCriteria.getScheduleId().get().matches("\\d+")) {
                Specification<ScheduleEmployee> currentSpec = ScheduleEmployeeSpecification
                        .scheduleIdEqual(scheduleEmployeeCriteria.getScheduleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (scheduleEmployeeCriteria.getEmployeeId() != null
                && scheduleEmployeeCriteria.getEmployeeId().isPresent()) {
            if (scheduleEmployeeCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<ScheduleEmployee> currentSpec = ScheduleEmployeeSpecification
                        .employeeIdEqual(scheduleEmployeeCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }

        return this.scheduleEmployeeRepository.findAll(combinedSpec, sort);
    }

    public List<ScheduleEmployeeDTO> getAllFormat(ScheduleEmployeeCriteria scheduleEmployeeCriteria) {
        List<ScheduleEmployeeDTO> listScheduleEmployeeFormat = new ArrayList<>();
        for (ScheduleEmployee scheduleEmployee : getAll(scheduleEmployeeCriteria)) {
            listScheduleEmployeeFormat.add(
                    new ScheduleEmployeeDTO(scheduleEmployee.getId().getScheduleId(),
                            scheduleEmployee.getId().getEmployeeId()));
        }

        return listScheduleEmployeeFormat;
    }

    public List<ScheduleEmployee> getAllByScheduleId(Integer scheduleId) {
        return this.scheduleEmployeeRepository.findAllByScheduleId(scheduleId);
    }

    public ScheduleEmployee upsert(ScheduleEmployee scheduleEmployee) {
        return this.scheduleEmployeeRepository.save(scheduleEmployee);
    }

    public void clearAllByScheduleId(Integer scheduleId) {
        this.scheduleEmployeeRepository.deleteAllByScheduleId(scheduleId);
    }
}