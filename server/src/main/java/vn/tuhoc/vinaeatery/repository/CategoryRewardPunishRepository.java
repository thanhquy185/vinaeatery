package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish;

@Repository
public interface CategoryRewardPunishRepository
        extends JpaRepository<CategoryRewardPunish, Integer>, JpaSpecificationExecutor<CategoryRewardPunish> {
    // Methods
    CategoryRewardPunish findOneById(Integer id);

    void deleteById(Integer id);
}
