package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.domain.entity.CategoryFood_;
import vn.tuhoc.vinaeatery.domain.entity.CategoryFood;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryFoodRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryFoodSpecification;

@Service
@RequiredArgsConstructor
public class CategoryFoodService {
    // Properties
    private final CategoryFoodRepository categoryFoodRepository;

    // Methods
    public CategoryFood getOneById(Integer id) {
        return this.categoryFoodRepository.findOneById(id);
    }

    public CategoryFood getLastOne() {
        return this.categoryFoodRepository.findLastOne();
    }

    public List<CategoryFood> getAll() {
        return this.categoryFoodRepository.findAll();
    }

    public List<CategoryFood> getAll(CategoryFoodCriteria categoryFoodCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryFoodCriteria.getSort() != null && categoryFoodCriteria.getSort().isPresent()) {
            String sortStr = categoryFoodCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại món ăn tăng dần" -> sort = Sort.by(CategoryFood_.ID).ascending();
                case "Mã loại món ăn giảm dần" -> sort = Sort.by(CategoryFood_.ID).descending();
                case "Tên loại món ăn tăng dần" -> sort = Sort.by(CategoryFood_.NAME).ascending();
                case "Tên loại món ăn giảm dần" -> sort = Sort.by(CategoryFood_.NAME).descending();
            }
        }

        //
        if (categoryFoodCriteria.getId() == null
                && categoryFoodCriteria.getRestaurantId() == null
                && categoryFoodCriteria.getName() == null
                && categoryFoodCriteria.getStatus() == null
                && categoryFoodCriteria.getSort() == null) {
            return this.categoryFoodRepository.findAll(sort);
        }
        //
        Specification<CategoryFood> combinedSpec = Specification.where(null);
        if (categoryFoodCriteria.getId() != null && categoryFoodCriteria.getId().isPresent()) {
            if (categoryFoodCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryFood> currentSpec = CategoryFoodSpecification
                        .idEqual(categoryFoodCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if(categoryFoodCriteria.getRestaurantId() != null && categoryFoodCriteria.getRestaurantId().isPresent()) {
            if (categoryFoodCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<CategoryFood> currentSpec = CategoryFoodSpecification
                        .restaurantIdEqual(categoryFoodCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (categoryFoodCriteria.getName() != null && categoryFoodCriteria.getName().isPresent()) {
            Specification<CategoryFood> currentSpec = CategoryFoodSpecification
                    .nameLike(categoryFoodCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryFoodCriteria.getStatus() != null && categoryFoodCriteria.getStatus().isPresent()) {
            String statusString = categoryFoodCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryFood> currentSpec = CategoryFoodSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryFoodRepository.findAll(combinedSpec, sort);
    }

    public CategoryFood upsert(CategoryFood categoryFood) {
        return this.categoryFoodRepository.save(categoryFood);
    }

    public void delete(Integer id) {
        this.categoryFoodRepository.deleteById(id);
    }

    public void lock(CategoryFood categoryFood) {
        this.categoryFoodRepository.save(categoryFood);
    }
}
