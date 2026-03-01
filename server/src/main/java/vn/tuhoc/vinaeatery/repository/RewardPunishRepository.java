package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.RewardPunish;

@Repository
public interface RewardPunishRepository
        extends JpaRepository<RewardPunish, Integer>, JpaSpecificationExecutor<RewardPunish> {
    // Methods
    RewardPunish findOneById(Integer id);

    List<RewardPunish> findAllByCategoryRewardPunishId(Integer categoryRewardPunishId);

    void deleteById(Integer id);
}
