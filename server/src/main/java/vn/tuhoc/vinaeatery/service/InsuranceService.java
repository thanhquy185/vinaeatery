package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.InsuranceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.InsuranceDTO;
import vn.tuhoc.vinaeatery.domain.dto.InsuranceDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.Insurance;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail;
import vn.tuhoc.vinaeatery.domain.entity.Insurance_;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.InsuranceDetailRepository;
import vn.tuhoc.vinaeatery.repository.InsuranceRepository;
import vn.tuhoc.vinaeatery.service.specification.InsuranceSpecification;

@Service
@RequiredArgsConstructor
public class InsuranceService {
    // Properties
    private final CategoryInsuranceService categoryInsuranceService;
    private final InsuranceRepository insuranceRepository;
    private final InsuranceDetailRepository insuranceDetailRepository;

    // Methods
    public Insurance getOneById(Integer id) {
        return this.insuranceRepository.findOneById(id);
    }

    public InsuranceDTO getOneFormatById(Integer id) {
        InsuranceDTO insuranceDTO = new InsuranceDTO();
        Insurance insurance = this.insuranceRepository.findOneById(id);
        if (insurance != null) {
            List<InsuranceDetailDTO> listInsuranceDetail = new ArrayList<>();
            for (InsuranceDetail insuranceDetail : this.insuranceDetailRepository
                    .findAllByInsuranceId(insurance.getId())) {
                listInsuranceDetail
                        .add(new InsuranceDetailDTO(insurance.getId(), insuranceDetail.getId().getEmployeeId(),
                                insuranceDetail.getId().getCategoryInsuranceId(),
                                categoryInsuranceService.getOneById(insuranceDetail.getId().getCategoryInsuranceId())));
            }

            insuranceDTO.setId(insurance.getId());
            insuranceDTO.setRestaurantId(insurance.getRestaurantId());
            insuranceDTO.setName(insurance.getName());
            insuranceDTO.setMonth(insurance.getMonth());
            insuranceDTO.setNote(insurance.getNote());
            insuranceDTO.setStatus(insurance.getStatus());
            insuranceDTO.setInsuranceDetails(listInsuranceDetail);
        }

        return insuranceDTO;
    }

    public List<Insurance> getAll() {
        return this.insuranceRepository.findAll();
    }

    public List<Insurance> getAll(InsuranceCriteria insuranceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (insuranceCriteria.getSort() != null && insuranceCriteria.getSort().isPresent()) {
            String sortStr = insuranceCriteria.getSort().get();
            switch (sortStr) {
                case "Mã bảo hiểm tăng dần" -> sort = Sort.by(Insurance_.ID).ascending();
                case "Mã bảo hiểm giảm dần" -> sort = Sort.by(Insurance_.ID).descending();
                case "Tên bảo hiểm tăng dần" -> sort = Sort.by(Insurance_.NAME).ascending();
                case "Tên bảo hiểm giảm dần" -> sort = Sort.by(Insurance_.NAME).descending();
                case "Tháng tăng dần" -> sort = Sort.by(Insurance_.MONTH).ascending();
                case "Tháng giảm dần" -> sort = Sort.by(Insurance_.MONTH).descending();
            }
        }

        //
        if (insuranceCriteria.getId() == null
                && insuranceCriteria.getRestaurantId() == null
                && insuranceCriteria.getName() == null
                && insuranceCriteria.getStatus() == null
                && insuranceCriteria.getSort() == null) {
            return this.insuranceRepository.findAll(sort);
        }
        //
        Specification<Insurance> combinedSpec = Specification.where(null);
        if (insuranceCriteria.getId() != null && insuranceCriteria.getId().isPresent()) {
            if (insuranceCriteria.getId().get().matches("\\d+")) {
                Specification<Insurance> currentSpec = InsuranceSpecification
                        .idEqual(insuranceCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (insuranceCriteria.getRestaurantId() != null && insuranceCriteria.getRestaurantId().isPresent()) {
            if (insuranceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Insurance> currentSpec = InsuranceSpecification
                        .restaurantIdEqual(insuranceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (insuranceCriteria.getName() != null && insuranceCriteria.getName().isPresent()) {
            Specification<Insurance> currentSpec = InsuranceSpecification
                    .nameLike(insuranceCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (insuranceCriteria.getStatus() != null && insuranceCriteria.getStatus().isPresent()) {
            String statusString = insuranceCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Insurance> currentSpec = InsuranceSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.insuranceRepository.findAll(combinedSpec, sort);
    }

    public List<InsuranceDTO> getAllFormat(InsuranceCriteria insuranceCriteria) {
        List<InsuranceDTO> listFormat = new ArrayList<>();
        for (Insurance insurance : getAll(insuranceCriteria)) {
            listFormat.add(getOneFormatById(insurance.getId()));
        }

        return listFormat;
    }

    public Insurance upsert(Insurance insurance) {
        return this.insuranceRepository.save(insurance);
    }

    public void deleteById(Integer id) {
        this.insuranceRepository.deleteById(id);
    }

    public void lock(Insurance insurance) {
        this.insuranceRepository.save(insurance);
    }
}