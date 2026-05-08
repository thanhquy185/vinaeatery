package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.AllowanceDetailCriteria;
import vn.tuhoc.vinaeatery.domain.dto.AllowanceDetailDTO;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetail;
import vn.tuhoc.vinaeatery.repository.AllowanceDetailRepository;
import vn.tuhoc.vinaeatery.service.specification.AllowanceDetailSpecification;

@Service
@RequiredArgsConstructor
public class AllowanceDetailService {
    // Properties
    private final CategoryAllowanceService categoryAllowanceService;
    private final AllowanceDetailRepository allowanceDetailRepository;

    // Methods
    public List<AllowanceDetail> getAll(AllowanceDetailCriteria allowanceDetailCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (allowanceDetailCriteria.getSort() != null && allowanceDetailCriteria.getSort().isPresent()) {
            String sortStr = allowanceDetailCriteria.getSort().get();
            switch (sortStr) {
                case "Mã phụ cấp tăng dần" -> sort = Sort.by("id.allowanceId").ascending();
                case "Mã phụ cấp giảm dần" -> sort = Sort.by("id.allowanceId").descending();
                case "Mã nhân viên tăng dần" -> sort = Sort.by("id.employeeId").ascending();
                case "Mã nhân viên giảm dần" -> sort = Sort.by("id.employeeId").descending();
                case "Mã loại phụ cấp tăng dần" -> sort = Sort.by("id.categoryAllowanceId").ascending();
                case "Mã loại phụ cấp giảm dần" -> sort = Sort.by("id.categoryAllowanceId").descending();
            }
        }

        //
        if (allowanceDetailCriteria.getAllowanceId() == null
                && allowanceDetailCriteria.getEmployeeId() == null
                && allowanceDetailCriteria.getCategoryAllowanceId() == null
                && allowanceDetailCriteria.getSort() == null) {
            return this.allowanceDetailRepository.findAll(sort);
        }
        //
        Specification<AllowanceDetail> combinedSpec = Specification.where(null);
        if (allowanceDetailCriteria.getAllowanceId() != null
                && allowanceDetailCriteria.getAllowanceId().isPresent()) {
            if (allowanceDetailCriteria.getAllowanceId().get().matches("\\d+")) {
                Specification<AllowanceDetail> currentSpec = AllowanceDetailSpecification
                        .allowanceIdEqual(allowanceDetailCriteria.getAllowanceId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (allowanceDetailCriteria.getEmployeeId() != null
                && allowanceDetailCriteria.getEmployeeId().isPresent()) {
            if (allowanceDetailCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<AllowanceDetail> currentSpec = AllowanceDetailSpecification
                        .employeeIdEqual(allowanceDetailCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (allowanceDetailCriteria.getCategoryAllowanceId() != null
                && allowanceDetailCriteria.getCategoryAllowanceId().isPresent()) {
            if (allowanceDetailCriteria.getCategoryAllowanceId().get().matches("\\d+")) {
                Specification<AllowanceDetail> currentSpec = AllowanceDetailSpecification
                        .categoryAllowanceIdEqual(allowanceDetailCriteria.getCategoryAllowanceId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }

        return this.allowanceDetailRepository.findAll(combinedSpec, sort);
    }

    public List<AllowanceDetailDTO> getAllFormat(AllowanceDetailCriteria allowanceDetailCriteria) {
        List<AllowanceDetailDTO> listAllowanceDetailFormat = new ArrayList<>();
        for (AllowanceDetail allowanceDetail : getAll(allowanceDetailCriteria)) {
            listAllowanceDetailFormat.add(
                    new AllowanceDetailDTO(allowanceDetail.getId().getAllowanceId(),
                            allowanceDetail.getId().getEmployeeId(), allowanceDetail.getId().getCategoryAllowanceId(),
                            categoryAllowanceService.getOneById(allowanceDetail.getId().getCategoryAllowanceId())));
        }

        return listAllowanceDetailFormat;
    }

    public List<AllowanceDetail> getAllByAllowanceId(Integer allowanceId) {
        return this.allowanceDetailRepository.findAllByAllowanceId(allowanceId);
    }

    public AllowanceDetail upsert(AllowanceDetail allowanceDetail) {
        return this.allowanceDetailRepository.save(allowanceDetail);
    }

    public void clearAllByAllowanceId(Integer allowanceId) {
        this.allowanceDetailRepository.deleteAllByAllowanceId(allowanceId);
    }
}