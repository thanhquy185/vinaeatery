package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.AllowanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.AllowanceDTO;
import vn.tuhoc.vinaeatery.domain.dto.AllowanceDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.Allowance;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail;
import vn.tuhoc.vinaeatery.domain.entity.Allowance_;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.AllowanceDetailRepository;
import vn.tuhoc.vinaeatery.repository.AllowanceRepository;
import vn.tuhoc.vinaeatery.service.specification.AllowanceSpecification;

@Service
@RequiredArgsConstructor
public class AllowanceService {
    // Properties
    private final CategoryAllowanceService categoryAllowanceService;
    private final AllowanceRepository allowanceRepository;
    private final AllowanceDetailRepository allowanceDetailRepository;

    // Methods
    public Allowance getOneById(Integer id) {
        return this.allowanceRepository.findOneById(id);
    }

    public AllowanceDTO getOneFormatById(Integer id) {
        AllowanceDTO allowanceDTO = new AllowanceDTO();
        Allowance allowance = this.allowanceRepository.findOneById(id);
        if (allowance != null) {
            List<AllowanceDetailDTO> listAllowanceDetail = new ArrayList<>();
            for (AllowanceDetail allowanceDetail : this.allowanceDetailRepository
                    .findAllByAllowanceId(allowance.getId())) {
                listAllowanceDetail
                        .add(new AllowanceDetailDTO(allowance.getId(), allowanceDetail.getId().getEmployeeId(),
                                allowanceDetail.getId().getCategoryAllowanceId(),
                                categoryAllowanceService.getOneById(allowanceDetail.getId().getCategoryAllowanceId())));
            }

            allowanceDTO.setId(allowance.getId());
            allowanceDTO.setRestaurantId(allowance.getRestaurantId());
            allowanceDTO.setName(allowance.getName());
            allowanceDTO.setMonth(allowance.getMonth());
            allowanceDTO.setNote(allowance.getNote());
            allowanceDTO.setStatus(allowance.getStatus());
            allowanceDTO.setAllowanceDetails(listAllowanceDetail);
        }

        return allowanceDTO;
    }

    public List<Allowance> getAll() {
        return this.allowanceRepository.findAll();
    }

    public List<Allowance> getAll(AllowanceCriteria allowanceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (allowanceCriteria.getSort() != null && allowanceCriteria.getSort().isPresent()) {
            String sortStr = allowanceCriteria.getSort().get();
            switch (sortStr) {
                case "Mã phụ cấp tăng dần" -> sort = Sort.by(Allowance_.ID).ascending();
                case "Mã phụ cấp giảm dần" -> sort = Sort.by(Allowance_.ID).descending();
                case "Tên phụ cấp tăng dần" -> sort = Sort.by(Allowance_.NAME).ascending();
                case "Tên phụ cấp giảm dần" -> sort = Sort.by(Allowance_.NAME).descending();
                case "Tháng tăng dần" -> sort = Sort.by(Allowance_.MONTH).ascending();
                case "Tháng giảm dần" -> sort = Sort.by(Allowance_.MONTH).descending();
            }
        }

        //
        if (allowanceCriteria.getId() == null
                && allowanceCriteria.getRestaurantId() == null
                && allowanceCriteria.getName() == null
                && allowanceCriteria.getStatus() == null
                && allowanceCriteria.getSort() == null) {
            return this.allowanceRepository.findAll(sort);
        }
        //
        Specification<Allowance> combinedSpec = Specification.where(null);
        if (allowanceCriteria.getId() != null && allowanceCriteria.getId().isPresent()) {
            if (allowanceCriteria.getId().get().matches("\\d+")) {
                Specification<Allowance> currentSpec = AllowanceSpecification
                        .idEqual(allowanceCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (allowanceCriteria.getRestaurantId() != null && allowanceCriteria.getRestaurantId().isPresent()) {
            if (allowanceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Allowance> currentSpec = AllowanceSpecification
                        .restaurantIdEqual(allowanceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (allowanceCriteria.getName() != null && allowanceCriteria.getName().isPresent()) {
            Specification<Allowance> currentSpec = AllowanceSpecification
                    .nameLike(allowanceCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (allowanceCriteria.getStatus() != null && allowanceCriteria.getStatus().isPresent()) {
            String statusString = allowanceCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Allowance> currentSpec = AllowanceSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.allowanceRepository.findAll(combinedSpec, sort);
    }

    public List<AllowanceDTO> getAllFormat(AllowanceCriteria allowanceCriteria) {
        List<AllowanceDTO> listFormat = new ArrayList<>();
        for (Allowance allowance : getAll(allowanceCriteria)) {
            listFormat.add(getOneFormatById(allowance.getId()));
        }

        return listFormat;
    }

    public Allowance upsert(Allowance allowance) {
        return this.allowanceRepository.save(allowance);
    }

    public void deleteById(Integer id) {
        this.allowanceRepository.deleteById(id);
    }

    public void lock(Allowance allowance) {
        this.allowanceRepository.save(allowance);
    }
}