package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ScheduleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleDTO;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleEmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleShiftDTO;
import vn.tuhoc.vinaeatery.domain.entity.Schedule;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift;
import vn.tuhoc.vinaeatery.domain.entity.Schedule_;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.ScheduleEmployeeRepository;
import vn.tuhoc.vinaeatery.repository.ScheduleRepository;
import vn.tuhoc.vinaeatery.repository.ScheduleShiftRepository;
import vn.tuhoc.vinaeatery.service.specification.ScheduleSpecification;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    // Properties
    private final ShiftService shiftService;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleEmployeeRepository scheduleEmployeeRepository;
    private final ScheduleShiftRepository scheduleShiftRepository;

    // Methods
    public Schedule getOneById(Integer id) {
        return this.scheduleRepository.findOneById(id);
    }

    public ScheduleDTO getOneFormatById(Integer id) {
        ScheduleDTO scheduleDTO = new ScheduleDTO();
        Schedule schedule = this.scheduleRepository.findOneById(id);
        if (schedule != null) {
            List<ScheduleEmployeeDTO> listScheduleEmployee = new ArrayList<>();
            for (ScheduleEmployee scheduleEmployee : this.scheduleEmployeeRepository
                    .findAllByScheduleId(schedule.getId())) {
                listScheduleEmployee
                        .add(new ScheduleEmployeeDTO(schedule.getId(), scheduleEmployee.getId().getEmployeeId()));
            }
            List<ScheduleShiftDTO> listScheduleShift = new ArrayList<>();
            for (ScheduleShift scheduleShift : this.scheduleShiftRepository
                    .findAllByScheduleId(schedule.getId())) {
                listScheduleShift
                        .add(new ScheduleShiftDTO(schedule.getId(), scheduleShift.getId().getShiftId(),
                                this.shiftService.getOneFormatById(scheduleShift.getId().getShiftId())));
            }

            scheduleDTO.setId(schedule.getId());
            scheduleDTO.setRestaurantId(schedule.getRestaurantId());
            scheduleDTO.setName(schedule.getName());
            scheduleDTO.setDateStart(schedule.getDateStart());
            scheduleDTO.setDateEnd(schedule.getDateEnd());
            scheduleDTO.setNote(schedule.getNote());
            scheduleDTO.setStatus(schedule.getStatus());
            scheduleDTO.setUpdateAt(schedule.getUpdateAt());
            scheduleDTO.setScheduleEmployees(listScheduleEmployee);
            scheduleDTO.setScheduleShifts(listScheduleShift);
        }

        return scheduleDTO;
    }

    public List<Schedule> getAll() {
        return this.scheduleRepository.findAll();
    }

    public List<Schedule> getAll(ScheduleCriteria scheduleCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (scheduleCriteria.getSort() != null && scheduleCriteria.getSort().isPresent()) {
            String sortStr = scheduleCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Schedule_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Schedule_.ID).descending();
                case "Tên tăng dần" -> sort = Sort.by(Schedule_.NAME).ascending();
                case "Tên giảm dần" -> sort = Sort.by(Schedule_.NAME).descending();
                case "Ngày bắt đầu tăng dần" -> sort = Sort.by(Schedule_.DATE_START).ascending();
                case "Ngày bắt đầu giảm dần" -> sort = Sort.by(Schedule_.DATE_START).descending();
                case "Ngày kết thúc tăng dần" -> sort = Sort.by(Schedule_.DATE_END).ascending();
                case "Ngày kết thúc giảm dần" -> sort = Sort.by(Schedule_.DATE_END).descending();
            }
        }

        //
        if (scheduleCriteria.getId() == null
                && scheduleCriteria.getRestaurantId() == null
                && scheduleCriteria.getName() == null
                && scheduleCriteria.getStatus() == null
                && scheduleCriteria.getSort() == null) {
            return this.scheduleRepository.findAll(sort);
        }
        //
        Specification<Schedule> combinedSpec = Specification.where(null);
        if (scheduleCriteria.getId() != null && scheduleCriteria.getId().isPresent()) {
            if (scheduleCriteria.getId().get().matches("\\d+")) {
                Specification<Schedule> currentSpec = ScheduleSpecification
                        .idEqual(scheduleCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (scheduleCriteria.getRestaurantId() != null && scheduleCriteria.getRestaurantId().isPresent()) {
            if (scheduleCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Schedule> currentSpec = ScheduleSpecification
                        .restaurantIdEqual(scheduleCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (scheduleCriteria.getName() != null && scheduleCriteria.getName().isPresent()) {
            Specification<Schedule> currentSpec = ScheduleSpecification
                    .nameLike(scheduleCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (scheduleCriteria.getStatus() != null && scheduleCriteria.getStatus().isPresent()) {
            String statusString = scheduleCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Schedule> currentSpec = ScheduleSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.scheduleRepository.findAll(combinedSpec, sort);
    }

    public List<ScheduleDTO> getAllFormat(ScheduleCriteria scheduleCriteria) {
        List<ScheduleDTO> listFormat = new ArrayList<>();
        for (Schedule schedule : getAll(scheduleCriteria)) {
            listFormat.add(getOneFormatById(schedule.getId()));
        }

        return listFormat;
    }

    public Schedule upsert(Schedule schedule) {
        return this.scheduleRepository.save(schedule);
    }

    public void deleteById(Integer id) {
        this.scheduleRepository.deleteById(id);
    }

    public void lock(Schedule Schedule) {
        this.scheduleRepository.save(Schedule);
    }
}