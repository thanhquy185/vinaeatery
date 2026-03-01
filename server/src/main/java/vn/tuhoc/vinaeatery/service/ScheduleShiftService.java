package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ScheduleShiftCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleShiftDTO;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId;
import vn.tuhoc.vinaeatery.repository.ScheduleShiftRepository;
import vn.tuhoc.vinaeatery.service.specification.ScheduleShiftSpecification;

@Service
@RequiredArgsConstructor
public class ScheduleShiftService {
    // Properties
    private final ShiftService shiftService;
    private final ScheduleShiftRepository scheduleShiftRepository;

    // Methods
    public List<ScheduleShift> getAll(ScheduleShiftCriteria scheduleShiftCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (scheduleShiftCriteria.getSort() != null && scheduleShiftCriteria.getSort().isPresent()) {
            String sortStr = scheduleShiftCriteria.getSort().get();
            switch (sortStr) {
                case "Mã lịch làm tăng dần" -> sort = Sort.by("id.scheduleId").ascending();
                case "Mã lịch làm giảm dần" -> sort = Sort.by("id.scheduleId").descending();
                case "Mã nhân viên tăng dần" -> sort = Sort.by("id.ShiftId").ascending();
                case "Mã nhân viên giảm dần" -> sort = Sort.by("id.ShiftId").descending();
            }
        }

        //
        if (scheduleShiftCriteria.getScheduleId() == null
                && scheduleShiftCriteria.getShiftId() == null
                && scheduleShiftCriteria.getSort() == null) {
            return this.scheduleShiftRepository.findAll(sort);
        }
        //
        Specification<ScheduleShift> combinedSpec = Specification.where(null);
        if (scheduleShiftCriteria.getScheduleId() != null
                && scheduleShiftCriteria.getScheduleId().isPresent()) {
            if (scheduleShiftCriteria.getScheduleId().get().matches("\\d+")) {
                Specification<ScheduleShift> currentSpec = ScheduleShiftSpecification
                        .scheduleIdEqual(scheduleShiftCriteria.getScheduleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (scheduleShiftCriteria.getShiftId() != null
                && scheduleShiftCriteria.getShiftId().isPresent()) {
            if (scheduleShiftCriteria.getShiftId().get().matches("\\d+")) {
                Specification<ScheduleShift> currentSpec = ScheduleShiftSpecification
                        .shiftIdEqual(scheduleShiftCriteria.getShiftId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }

        return this.scheduleShiftRepository.findAll(combinedSpec, sort);
    }

    public List<ScheduleShiftDTO> getAllFormat(ScheduleShiftCriteria scheduleShiftCriteria) {
        List<ScheduleShiftDTO> listScheduleShiftFormat = new ArrayList<>();
        for (ScheduleShift scheduleShift : getAll(scheduleShiftCriteria)) {
            listScheduleShiftFormat.add(
                    new ScheduleShiftDTO(scheduleShift.getId().getScheduleId(),
                            scheduleShift.getId().getShiftId(),
                            this.shiftService.getOneFormatById(scheduleShift.getId().getShiftId())));
        }

        return listScheduleShiftFormat;
    }

    public List<ScheduleShift> getAllByScheduleId(Integer scheduleId) {
        return this.scheduleShiftRepository.findAllByScheduleId(scheduleId);
    }

    public ScheduleShift upsert(ScheduleShift scheduleShift) {
        return this.scheduleShiftRepository.save(scheduleShift);
    }

    public void clearAllByScheduleId(Integer scheduleId) {
        this.scheduleShiftRepository.deleteAllByScheduleId(scheduleId);
    }
}