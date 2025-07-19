package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryIngredient_;
import vn.tuhoc.vinaeatery.domain.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryIngredientRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryIngredientSpecification;

@Service
@AllArgsConstructor
public class CategoryIngredientService {
    // Properties
    private final CategoryIngredientRepository categoryIngredientRepository;

    // Methods
    public CategoryIngredient getOneById(Integer id) {
        return this.categoryIngredientRepository.findOneById(id);
    }

    public List<CategoryIngredient> getAll() {
        return this.categoryIngredientRepository.findAll();
    }

    public List<CategoryIngredient> getAll(CategoryIngredientCriteria categoryIngredientCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryIngredientCriteria.getSort() != null && categoryIngredientCriteria.getSort().isPresent()) {
            String sortStr = categoryIngredientCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryIngredient_.ID).ascending();
                case "Mã loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryIngredient_.ID).descending();
                case "Tên loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryIngredient_.NAME).ascending();
                case "Tên loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryIngredient_.NAME).descending();
            }
        }

        //
        if (categoryIngredientCriteria.getId() == null && categoryIngredientCriteria.getName() == null
                && categoryIngredientCriteria.getStatus() == null && categoryIngredientCriteria.getSort() == null) {
            return this.categoryIngredientRepository.findAll(sort);
        }
        //
        Specification<CategoryIngredient> combinedSpec = Specification.where(null);
        if (categoryIngredientCriteria.getId() != null && categoryIngredientCriteria.getId().isPresent()) {
            if (categoryIngredientCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryIngredient> currentSpec = CategoryIngredientSpecification
                        .idEqual(categoryIngredientCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryIngredientCriteria.getName() != null && categoryIngredientCriteria.getName().isPresent()) {
            Specification<CategoryIngredient> currentSpec = CategoryIngredientSpecification
                    .nameLike(categoryIngredientCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryIngredientCriteria.getStatus() != null && categoryIngredientCriteria.getStatus().isPresent()) {
            String statusString = categoryIngredientCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryIngredient> currentSpec = CategoryIngredientSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryIngredientRepository.findAll(combinedSpec, sort);
    }

    public CategoryIngredient upsert(CategoryIngredient categoryIngredient) {
        return this.categoryIngredientRepository.save(categoryIngredient);
    }

    public void delete(Integer id) {
        this.categoryIngredientRepository.deleteById(id);
    }

    public void lock(CategoryIngredient categoryIngredient) {
        this.categoryIngredientRepository.save(categoryIngredient);
    }
}
