package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ShiftCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ShiftDTO;
import vn.tuhoc.vinaeatery.domain.dto.ShiftDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.Shift;
import vn.tuhoc.vinaeatery.domain.entity.Shift_;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.ShiftDetailRepository;
import vn.tuhoc.vinaeatery.repository.ShiftRepository;
import vn.tuhoc.vinaeatery.service.specification.ShiftSpecification;

@Service
@RequiredArgsConstructor
public class ShiftService {
    // Properties
    private final ShiftRepository shiftRepository;
    private final ShiftDetailRepository shiftDetailRepository;

    // Methods
    public Shift getOneById(Integer id) {
        return this.shiftRepository.findOneById(id);
    }

    public ShiftDTO getOneFormatById(Integer id) {
        ShiftDTO shiftDTO = new ShiftDTO();
        Shift shift = this.shiftRepository.findOneById(id);
        if (shift != null) {
            List<ShiftDetailDTO> listShiftDetail = new ArrayList<>();
            for (ShiftDetail shiftDetail : this.shiftDetailRepository
                    .findAllByShiftId(shift.getId())) {
                listShiftDetail.add(new ShiftDetailDTO(shiftDetail.getId().getShiftId(),
                        shiftDetail.getId().getDayOfWeek(),
                        shiftDetail.getId().getTimeStart(),
                        shiftDetail.getId().getTimeEnd()));
            }

            shiftDTO.setId(shift.getId());
            shiftDTO.setRestaurantId(shift.getRestaurantId());
            shiftDTO.setName(shift.getName());
            shiftDTO.setStatus(shift.getStatus());
            shiftDTO.setUpdateAt(shift.getUpdateAt());
            shiftDTO.setShiftDetails(listShiftDetail);
        }

        return shiftDTO;
    }

    public List<Shift> getAll() {
        return this.shiftRepository.findAll();
    }

    public List<Shift> getAll(ShiftCriteria shiftCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (shiftCriteria.getSort() != null && shiftCriteria.getSort().isPresent()) {
            String sortStr = shiftCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Shift_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Shift_.ID).descending();
                case "Tên tăng dần" -> sort = Sort.by(Shift_.NAME).ascending();
                case "Tên giảm dần" -> sort = Sort.by(Shift_.NAME).descending();
            }
        }

        //
        if (shiftCriteria.getId() == null
                && shiftCriteria.getRestaurantId() == null
                && shiftCriteria.getName() == null
                && shiftCriteria.getStatus() == null
                && shiftCriteria.getSort() == null) {
            return this.shiftRepository.findAll(sort);
        }
        //
        Specification<Shift> combinedSpec = Specification.where(null);
        if (shiftCriteria.getId() != null && shiftCriteria.getId().isPresent()) {
            if (shiftCriteria.getId().get().matches("\\d+")) {
                Specification<Shift> currentSpec = ShiftSpecification
                        .idEqual(shiftCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (shiftCriteria.getRestaurantId() != null && shiftCriteria.getRestaurantId().isPresent()) {
            if (shiftCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Shift> currentSpec = ShiftSpecification
                        .restaurantIdEqual(shiftCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (shiftCriteria.getName() != null && shiftCriteria.getName().isPresent()) {
            Specification<Shift> currentSpec = ShiftSpecification
                    .nameLike(shiftCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (shiftCriteria.getStatus() != null && shiftCriteria.getStatus().isPresent()) {
            String statusString = shiftCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Shift> currentSpec = ShiftSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.shiftRepository.findAll(combinedSpec, sort);
    }

    public List<ShiftDTO> getAllFormat(ShiftCriteria shiftCriteria) {
        List<ShiftDTO> listFormat = new ArrayList<>();
        for (Shift shift : getAll(shiftCriteria)) {
            listFormat.add(getOneFormatById(shift.getId()));
        }

        return listFormat;
    }

    public Shift upsert(Shift shift) {
        return this.shiftRepository.save(shift);
    }

    public void deleteById(Integer id) {
        this.shiftRepository.deleteById(id);
    }

    public void lock(Shift shift) {
        this.shiftRepository.save(shift);
    }
}