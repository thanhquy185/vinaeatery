package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Floor;
import vn.tuhoc.vinaeatery.domain.Floor_;
import vn.tuhoc.vinaeatery.domain.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.FloorRepository;
import vn.tuhoc.vinaeatery.service.specification.FloorSpecification;

@Service
@RequiredArgsConstructor
public class FloorService {
    // Properties
    private final FloorRepository floorRepository;

    // Methods
    public Floor getOneById(Integer id) {
        return this.floorRepository.findOneById(id);
    }

    public List<Floor> getAll() {
        return this.floorRepository.findAll();
    }

    public List<Floor> getAll(FloorCriteria floorCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (floorCriteria.getSort() != null && floorCriteria.getSort().isPresent()) {
            String sortStr = floorCriteria.getSort().get();
            switch (sortStr) {
                case "Mã tầng tăng dần" -> sort = Sort.by(Floor_.ID).ascending();
                case "Mã tầng giảm dần" -> sort = Sort.by(Floor_.ID).descending();
                case "Tên tầng tăng dần" -> sort = Sort.by(Floor_.NAME).ascending();
                case "Tên tầng giảm dần" -> sort = Sort.by(Floor_.NAME).descending();
            }
        }

        //
        if (floorCriteria.getId() == null && floorCriteria.getName() == null
                && floorCriteria.getStatus() == null && floorCriteria.getSort() == null) {
            return this.floorRepository.findAll(sort);
        }
        //
        Specification<Floor> combinedSpec = Specification.where(null);
        if (floorCriteria.getId() != null && floorCriteria.getId().isPresent()) {
            if (floorCriteria.getId().get().matches("\\d+")) {
                Specification<Floor> currentSpec = FloorSpecification
                        .idEqual(floorCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (floorCriteria.getName() != null && floorCriteria.getName().isPresent()) {
            Specification<Floor> currentSpec = FloorSpecification
                    .nameLike(floorCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (floorCriteria.getStatus() != null && floorCriteria.getStatus().isPresent()) {
            String statusString = floorCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Floor> currentSpec = FloorSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.floorRepository.findAll(combinedSpec, sort);
    }

    public Floor upsert(Floor floor) {
        return this.floorRepository.save(floor);
    }

    public void delete(Integer id) {
        this.floorRepository.deleteById(id);
    }

    public void lock(Floor floor) {
        this.floorRepository.save(floor);
    }
}
