package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryRewardPunishCriteria;
import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish_;
import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryRewardPunishHandleEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryRewardPunishRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryRewardPunishSpecification;

@Service
@RequiredArgsConstructor
public class CategoryRewardPunishService {
    // Properties
    private final CategoryRewardPunishRepository categoryRewardPunishRepository;

    // Methods
    public CategoryRewardPunish getOneById(Integer id) {
        return this.categoryRewardPunishRepository.findOneById(id);
    }

    public List<CategoryRewardPunish> getAll() {
        return this.categoryRewardPunishRepository.findAll();
    }

    public List<CategoryRewardPunish> getAll(CategoryRewardPunishCriteria categoryRewardPunishCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryRewardPunishCriteria.getSort() != null && categoryRewardPunishCriteria.getSort().isPresent()) {
            String sortStr = categoryRewardPunishCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryRewardPunish_.ID).ascending();
                case "Mã loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryRewardPunish_.ID).descending();
                case "Tên loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryRewardPunish_.NAME).ascending();
                case "Tên loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryRewardPunish_.NAME).descending();
                case "Xử lý tăng dần" -> sort = Sort.by(CategoryRewardPunish_.HANDLE).ascending();
                case "Xử lý giảm dần" -> sort = Sort.by(CategoryRewardPunish_.HANDLE).descending();
            }
        }

        //
        if (categoryRewardPunishCriteria.getId() == null
                && categoryRewardPunishCriteria.getRestaurantId() == null
                && categoryRewardPunishCriteria.getName() == null
                && categoryRewardPunishCriteria.getHandle() == null
                && categoryRewardPunishCriteria.getStatus() == null
                && categoryRewardPunishCriteria.getSort() == null) {
            return this.categoryRewardPunishRepository.findAll(sort);
        }
        //
        Specification<CategoryRewardPunish> combinedSpec = Specification.where(null);
        if (categoryRewardPunishCriteria.getId() != null && categoryRewardPunishCriteria.getId().isPresent()) {
            if (categoryRewardPunishCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryRewardPunish> currentSpec = CategoryRewardPunishSpecification
                        .idEqual(categoryRewardPunishCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryRewardPunishCriteria.getRestaurantId() != null
                && categoryRewardPunishCriteria.getRestaurantId().isPresent()) {
            if (categoryRewardPunishCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<CategoryRewardPunish> currentSpec = CategoryRewardPunishSpecification
                        .restaurantIdEqual(categoryRewardPunishCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (categoryRewardPunishCriteria.getName() != null && categoryRewardPunishCriteria.getName().isPresent()) {
            Specification<CategoryRewardPunish> currentSpec = CategoryRewardPunishSpecification
                    .nameLike(categoryRewardPunishCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryRewardPunishCriteria.getHandle() != null && categoryRewardPunishCriteria.getHandle().isPresent()) {
            String handleString = categoryRewardPunishCriteria.getHandle().get();
            String handleStringValue = null;
            for (CategoryRewardPunishHandleEnum commonStatus : CategoryRewardPunishHandleEnum.values()) {
                if (commonStatus.getDescription().equals(handleString)) {
                    handleStringValue = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryRewardPunish> currentSpec = CategoryRewardPunishSpecification
                    .handleEqual(handleStringValue);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (categoryRewardPunishCriteria.getStatus() != null && categoryRewardPunishCriteria.getStatus().isPresent()) {
            String statusString = categoryRewardPunishCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryRewardPunish> currentSpec = CategoryRewardPunishSpecification
                    .statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryRewardPunishRepository.findAll(combinedSpec, sort);
    }

    public CategoryRewardPunish upsert(CategoryRewardPunish categoryRewardPunish) {
        return this.categoryRewardPunishRepository.save(categoryRewardPunish);
    }

    public void delete(Integer id) {
        this.categoryRewardPunishRepository.deleteById(id);
    }

    public void lock(CategoryRewardPunish categoryRewardPunish) {
        this.categoryRewardPunishRepository.save(categoryRewardPunish);
    }
}
