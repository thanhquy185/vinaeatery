package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.InsuranceDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.InsuranceDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.InsuranceDetail;
import vn.tuhoc.vinaeatery.repository.InsuranceDetailRepository;
import vn.tuhoc.vinaeatery.service.specification.InsuranceDetailSpecification;

@Service
@RequiredArgsConstructor
public class InsuranceDetailService {
    // Properties
    private final CategoryInsuranceService categoryInsuranceService;
    private final InsuranceDetailRepository insuranceDetailRepository;

    // Methods
    public List<InsuranceDetail> getAll(InsuranceDetailCriteria insuranceDetailCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (insuranceDetailCriteria.getSort() != null && insuranceDetailCriteria.getSort().isPresent()) {
            String sortStr = insuranceDetailCriteria.getSort().get();
            switch (sortStr) {
                case "Mã bảo hiểm tăng dần" -> sort = Sort.by("id.insuranceId").ascending();
                case "Mã bảo hiểm giảm dần" -> sort = Sort.by("id.insuranceId").descending();
                case "Mã nhân viên tăng dần" -> sort = Sort.by("id.employeeId").ascending();
                case "Mã nhân viên giảm dần" -> sort = Sort.by("id.employeeId").descending();
                case "Mã loại bảo hiểm tăng dần" -> sort = Sort.by("id.categoryInsuranceId").ascending();
                case "Mã loại bảo hiểm giảm dần" -> sort = Sort.by("id.categoryInsuranceId").descending();
            }
        }

        //
        if (insuranceDetailCriteria.getInsuranceId() == null
                && insuranceDetailCriteria.getEmployeeId() == null
                && insuranceDetailCriteria.getCategoryInsuranceId() == null
                && insuranceDetailCriteria.getSort() == null) {
            return this.insuranceDetailRepository.findAll(sort);
        }
        //
        Specification<InsuranceDetail> combinedSpec = Specification.where(null);
        if (insuranceDetailCriteria.getInsuranceId() != null
                && insuranceDetailCriteria.getInsuranceId().isPresent()) {
            if (insuranceDetailCriteria.getInsuranceId().get().matches("\\d+")) {
                Specification<InsuranceDetail> currentSpec = InsuranceDetailSpecification
                        .insuranceIdEqual(insuranceDetailCriteria.getInsuranceId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (insuranceDetailCriteria.getEmployeeId() != null
                && insuranceDetailCriteria.getEmployeeId().isPresent()) {
            if (insuranceDetailCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<InsuranceDetail> currentSpec = InsuranceDetailSpecification
                        .employeeIdEqual(insuranceDetailCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (insuranceDetailCriteria.getCategoryInsuranceId() != null
                && insuranceDetailCriteria.getCategoryInsuranceId().isPresent()) {
            if (insuranceDetailCriteria.getCategoryInsuranceId().get().matches("\\d+")) {
                Specification<InsuranceDetail> currentSpec = InsuranceDetailSpecification
                        .categoryInsuranceIdEqual(insuranceDetailCriteria.getCategoryInsuranceId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }

        return this.insuranceDetailRepository.findAll(combinedSpec, sort);
    }

    public List<InsuranceDetailDTO> getAllFormat(InsuranceDetailCriteria insuranceDetailCriteria) {
        List<InsuranceDetailDTO> listInsuranceDetailFormat = new ArrayList<>();
        for (InsuranceDetail insuranceDetail : getAll(insuranceDetailCriteria)) {
            listInsuranceDetailFormat.add(
                    new InsuranceDetailDTO(insuranceDetail.getId().getInsuranceId(),
                            insuranceDetail.getId().getEmployeeId(), insuranceDetail.getId().getCategoryInsuranceId(),
                            categoryInsuranceService.getOneById(insuranceDetail.getId().getCategoryInsuranceId())));
        }

        return listInsuranceDetailFormat;
    }

    public List<InsuranceDetail> getAllByInsuranceId(Integer insuranceId) {
        return this.insuranceDetailRepository.findAllByInsuranceId(insuranceId);
    }

    public InsuranceDetail upsert(InsuranceDetail InsuranceDetail) {
        return this.insuranceDetailRepository.save(InsuranceDetail);
    }

    public void clearAllByInsuranceId(Integer insuranceId) {
        this.insuranceDetailRepository.deleteAllByInsuranceId(insuranceId);
    }
}