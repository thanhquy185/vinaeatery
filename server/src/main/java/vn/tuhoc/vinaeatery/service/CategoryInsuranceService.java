package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryInsuranceCriteria;
import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance_;
import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryInsuranceRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryInsuranceSpecification;

@Service
@RequiredArgsConstructor
public class CategoryInsuranceService {
    // Properties
    private final CategoryInsuranceRepository categoryInsuranceRepository;

    // Methods
    public CategoryInsurance getOneById(Integer id) {
        return this.categoryInsuranceRepository.findOneById(id);
    }

    public List<CategoryInsurance> getAll() {
        return this.categoryInsuranceRepository.findAll();
    }

    public List<CategoryInsurance> getAll(CategoryInsuranceCriteria categoryInsuranceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryInsuranceCriteria.getSort() != null && categoryInsuranceCriteria.getSort().isPresent()) {
            String sortStr = categoryInsuranceCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại bảo hiểm tăng dần" -> sort = Sort.by(CategoryInsurance_.ID).ascending();
                case "Mã loại bảo hiểm giảm dần" -> sort = Sort.by(CategoryInsurance_.ID).descending();
                case "Tên loại bảo hiểm tăng dần" -> sort = Sort.by(CategoryInsurance_.NAME).ascending();
                case "Tên loại bảo hiểm giảm dần" -> sort = Sort.by(CategoryInsurance_.NAME).descending();
            }
        }

        //
        if (categoryInsuranceCriteria.getId() == null
                && categoryInsuranceCriteria.getRestaurantId() == null
                && categoryInsuranceCriteria.getName() == null
                && categoryInsuranceCriteria.getStatus() == null
                && categoryInsuranceCriteria.getSort() == null) {
            return this.categoryInsuranceRepository.findAll(sort);
        }
        //
        Specification<CategoryInsurance> combinedSpec = Specification.where(null);
        if (categoryInsuranceCriteria.getId() != null && categoryInsuranceCriteria.getId().isPresent()) {
            if (categoryInsuranceCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryInsurance> currentSpec = CategoryInsuranceSpecification
                        .idEqual(categoryInsuranceCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryInsuranceCriteria.getRestaurantId() != null
                && categoryInsuranceCriteria.getRestaurantId().isPresent()) {
            if (categoryInsuranceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<CategoryInsurance> currentSpec = CategoryInsuranceSpecification
                        .restaurantIdEqual(categoryInsuranceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (categoryInsuranceCriteria.getName() != null && categoryInsuranceCriteria.getName().isPresent()) {
            Specification<CategoryInsurance> currentSpec = CategoryInsuranceSpecification
                    .nameLike(categoryInsuranceCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryInsuranceCriteria.getStatus() != null && categoryInsuranceCriteria.getStatus().isPresent()) {
            String statusString = categoryInsuranceCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryInsurance> currentSpec = CategoryInsuranceSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryInsuranceRepository.findAll(combinedSpec, sort);
    }

    public CategoryInsurance upsert(CategoryInsurance categoryInsurance) {
        return this.categoryInsuranceRepository.save(categoryInsurance);
    }

    public void delete(Integer id) {
        this.categoryInsuranceRepository.deleteById(id);
    }

    public void lock(CategoryInsurance categoryInsurance) {
        this.categoryInsuranceRepository.save(categoryInsurance);
    }
}
