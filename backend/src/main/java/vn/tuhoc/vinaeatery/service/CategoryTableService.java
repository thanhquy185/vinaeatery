package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryTable_;
import vn.tuhoc.vinaeatery.domain.CategoryTable;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryTableRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryTableSpecification;

@Service
@RequiredArgsConstructor
public class CategoryTableService {
    // Properties
    private final CategoryTableRepository categoryTableRepository;

    // Methods
    public CategoryTable getOneById(Integer id) {
        return this.categoryTableRepository.findOneById(id);
    }

    public List<CategoryTable> getAll() {
        return this.categoryTableRepository.findAll();
    }

    public List<CategoryTable> getAll(CategoryTableCriteria categoryTableCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryTableCriteria.getSort() != null && categoryTableCriteria.getSort().isPresent()) {
            String sortStr = categoryTableCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại bàn tăng dần" -> sort = Sort.by(CategoryTable_.ID).ascending();
                case "Mã loại bàn giảm dần" -> sort = Sort.by(CategoryTable_.ID).descending();
                case "Tên loại bàn tăng dần" -> sort = Sort.by(CategoryTable_.NAME).ascending();
                case "Tên loại bàn giảm dần" -> sort = Sort.by(CategoryTable_.NAME).descending();
            }
        }

        //
        if (categoryTableCriteria.getId() == null && categoryTableCriteria.getName() == null
                && categoryTableCriteria.getSurchargeType() == null
                && categoryTableCriteria.getStatus() == null
                && categoryTableCriteria.getSort() == null) {
            return this.categoryTableRepository.findAll(sort);
        }
        //
        Specification<CategoryTable> combinedSpec = Specification.where(null);
        if (categoryTableCriteria.getId() != null && categoryTableCriteria.getId().isPresent()) {
            if (categoryTableCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryTable> currentSpec = CategoryTableSpecification
                        .idEqual(categoryTableCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryTableCriteria.getName() != null && categoryTableCriteria.getName().isPresent()) {
            Specification<CategoryTable> currentSpec = CategoryTableSpecification
                    .nameLike(categoryTableCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
         if (categoryTableCriteria.getSurchargeType() != null && categoryTableCriteria.getSurchargeType().isPresent()) {
            Specification<CategoryTable> currentSpec = CategoryTableSpecification
                    .surchargeTypeEqual(categoryTableCriteria.getSurchargeType().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryTableCriteria.getStatus() != null && categoryTableCriteria.getStatus().isPresent()) {
            String statusString = categoryTableCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryTable> currentSpec = CategoryTableSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryTableRepository.findAll(combinedSpec, sort);
    }

    public CategoryTable upsert(CategoryTable categoryTable) {
        return this.categoryTableRepository.save(categoryTable);
    }

    public void delete(Integer id) {
        this.categoryTableRepository.deleteById(id);
    }

    public void lock(CategoryTable categoryTable) {
        this.categoryTableRepository.save(categoryTable);
    }
}
