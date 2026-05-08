package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryAllowanceCriteria;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance_;
import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryAllowanceRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryAllowanceSpecification;

@Service
@RequiredArgsConstructor
public class CategoryAllowanceService {
    // Properties
    private final CategoryAllowanceRepository categoryAllowanceRepository;

    // Methods
    public CategoryAllowance getOneById(Integer id) {
        return this.categoryAllowanceRepository.findOneById(id);
    }

    public List<CategoryAllowance> getAll() {
        return this.categoryAllowanceRepository.findAll();
    }

    public List<CategoryAllowance> getAll(CategoryAllowanceCriteria categoryAllowanceCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryAllowanceCriteria.getSort() != null && categoryAllowanceCriteria.getSort().isPresent()) {
            String sortStr = categoryAllowanceCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại phụ cấp tăng dần" -> sort = Sort.by(CategoryAllowance_.ID).ascending();
                case "Mã loại phụ cấp giảm dần" -> sort = Sort.by(CategoryAllowance_.ID).descending();
                case "Tên loại phụ cấp tăng dần" -> sort = Sort.by(CategoryAllowance_.NAME).ascending();
                case "Tên loại phụ cấp giảm dần" -> sort = Sort.by(CategoryAllowance_.NAME).descending();
            }
        }

        //
        if (categoryAllowanceCriteria.getId() == null
                && categoryAllowanceCriteria.getRestaurantId() == null
                && categoryAllowanceCriteria.getName() == null
                && categoryAllowanceCriteria.getStatus() == null
                && categoryAllowanceCriteria.getSort() == null) {
            return this.categoryAllowanceRepository.findAll(sort);
        }
        //
        Specification<CategoryAllowance> combinedSpec = Specification.where(null);
        if (categoryAllowanceCriteria.getId() != null && categoryAllowanceCriteria.getId().isPresent()) {
            if (categoryAllowanceCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryAllowance> currentSpec = CategoryAllowanceSpecification
                        .idEqual(categoryAllowanceCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryAllowanceCriteria.getRestaurantId() != null
                && categoryAllowanceCriteria.getRestaurantId().isPresent()) {
            if (categoryAllowanceCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<CategoryAllowance> currentSpec = CategoryAllowanceSpecification
                        .restaurantIdEqual(categoryAllowanceCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (categoryAllowanceCriteria.getName() != null && categoryAllowanceCriteria.getName().isPresent()) {
            Specification<CategoryAllowance> currentSpec = CategoryAllowanceSpecification
                    .nameLike(categoryAllowanceCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryAllowanceCriteria.getStatus() != null && categoryAllowanceCriteria.getStatus().isPresent()) {
            String statusString = categoryAllowanceCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryAllowance> currentSpec = CategoryAllowanceSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryAllowanceRepository.findAll(combinedSpec, sort);
    }

    public CategoryAllowance upsert(CategoryAllowance categoryAllowance) {
        return this.categoryAllowanceRepository.save(categoryAllowance);
    }

    public void delete(Integer id) {
        this.categoryAllowanceRepository.deleteById(id);
    }

    public void lock(CategoryAllowance categoryAllowance) {
        this.categoryAllowanceRepository.save(categoryAllowance);
    }
}
