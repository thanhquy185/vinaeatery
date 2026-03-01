package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ShiftDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ShiftDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail;
import vn.tuhoc.vinaeatery.repository.ShiftDetailRepository;
import vn.tuhoc.vinaeatery.service.specification.ShiftDetailSpecification;

@Service
@RequiredArgsConstructor
public class ShiftDetailService {
    // Properties
    private final ShiftDetailRepository shiftDetailRepository;

    // Methods
    public List<ShiftDetail> getAll(ShiftDetailCriteria shiftDetailCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (shiftDetailCriteria.getSort() != null && shiftDetailCriteria.getSort().isPresent()) {
            String sortStr = shiftDetailCriteria.getSort().get();
            switch (sortStr) {
                case "Mã ca làm tăng dần" -> sort = Sort.by("id.shiftId").ascending();
                case "Mã ca làm giảm dần" -> sort = Sort.by("id.shiftId").descending();
                case "Thứ trong tuần tăng dần" -> sort = Sort.by("id.dayOfWeek").ascending();
                case "Thứ trong tuần giảm dần" -> sort = Sort.by("id.dayOfWeek").descending();
                case "Thời gian bắt đầu tăng dần" -> sort = Sort.by("id.timeStart").ascending();
                case "Thời gian bắt đầu giảm dần" -> sort = Sort.by("id.timeStart").descending();
                case "Thời gian kết thúc tăng dần" -> sort = Sort.by("id.timeEnd").ascending();
                case "Thời gian kết thúc giảm dần" -> sort = Sort.by("id.timeEnd").descending();
            }
        }

        //
        if (shiftDetailCriteria.getShiftId() == null
                && shiftDetailCriteria.getDayOfWeek() == null
                && shiftDetailCriteria.getTimeStart() == null
                && shiftDetailCriteria.getTimeEnd() == null
                && shiftDetailCriteria.getSort() == null) {
            return this.shiftDetailRepository.findAll(sort);
        }
        //
        Specification<ShiftDetail> combinedSpec = Specification.where(null);
        if (shiftDetailCriteria.getShiftId() != null
                && shiftDetailCriteria.getShiftId().isPresent()) {
            if (shiftDetailCriteria.getShiftId().get().matches("\\d+")) {
                Specification<ShiftDetail> currentSpec = ShiftDetailSpecification
                        .shiftIdEqual(shiftDetailCriteria.getShiftId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (shiftDetailCriteria.getDayOfWeek() != null && shiftDetailCriteria.getDayOfWeek().isPresent()) {
            Specification<ShiftDetail> currentSpec = ShiftDetailSpecification
                    .dayOfWeekEqual(shiftDetailCriteria.getDayOfWeek().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (shiftDetailCriteria.getTimeStart() != null && shiftDetailCriteria.getTimeStart().isPresent()) {
            Specification<ShiftDetail> currentSpec = ShiftDetailSpecification
                    .timeStartEqual(shiftDetailCriteria.getTimeStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (shiftDetailCriteria.getTimeEnd() != null && shiftDetailCriteria.getTimeEnd().isPresent()) {
            Specification<ShiftDetail> currentSpec = ShiftDetailSpecification
                    .timeEndEqual(shiftDetailCriteria.getTimeEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.shiftDetailRepository.findAll(combinedSpec, sort);
    }

    public List<ShiftDetailDTO> getAllFormat(ShiftDetailCriteria shiftDetailCriteria) {
        List<ShiftDetailDTO> listShiftDetailFormat = new ArrayList<>();
        for (ShiftDetail shiftDetail : getAll(shiftDetailCriteria)) {
            listShiftDetailFormat.add(
                    new ShiftDetailDTO(shiftDetail.getId().getShiftId(),
                            shiftDetail.getId().getDayOfWeek(),
                            shiftDetail.getId().getTimeStart(),
                            shiftDetail.getId().getTimeEnd()));
        }

        return listShiftDetailFormat;
    }

    public List<ShiftDetail> getAllByShiftId(Integer shiftId) {
        return this.shiftDetailRepository.findAllByShiftId(shiftId);
    }

    public ShiftDetail upsert(ShiftDetail shiftDetail) {
        return this.shiftDetailRepository.save(shiftDetail);
    }

    public void clearAllByShiftId(Integer shiftId) {
        this.shiftDetailRepository.deleteAllByShiftId(shiftId);
    }
}