package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RewardPunishCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RewardPunishDTO;
import vn.tuhoc.vinaeatery.domain.entity.RewardPunish;
import vn.tuhoc.vinaeatery.domain.entity.RewardPunish_;
import vn.tuhoc.vinaeatery.domain.enumm.RewardPunishStatusEnum;
import vn.tuhoc.vinaeatery.repository.RewardPunishRepository;
import vn.tuhoc.vinaeatery.service.specification.RewardPunishSpecification;

@Service
@RequiredArgsConstructor
public class RewardPunishService {
    // Properties
    private final CategoryRewardPunishService categoryRewardPunishService;
    private final EmployeeService employeeService;
    private final RewardPunishRepository rewardPunishRepository;

    // Methods
    public RewardPunish getOneById(Integer id) {
        return this.rewardPunishRepository.findOneById(id);
    }

    public RewardPunishDTO getOneFormatById(Integer id) {
        RewardPunishDTO rewardPunishDTO = new RewardPunishDTO();
        RewardPunish rewardPunish = this.rewardPunishRepository.findOneById(id);
        if (rewardPunish != null) {
            rewardPunishDTO.setId(rewardPunish.getId());
            rewardPunishDTO.setRestaurantId(rewardPunish.getRestaurantId());
            rewardPunishDTO.setCreateAt(rewardPunish.getCreateAt());
            if (rewardPunish.getEmployeeHandleId() != null) {
                rewardPunishDTO
                        .setEmployeeHandle(employeeService.getOneFormatById(rewardPunish.getEmployeeHandleId()));
            }
            if (rewardPunish.getEmployeeMainId() != null) {
                rewardPunishDTO
                        .setEmployeeMain(employeeService.getOneFormatById(rewardPunish.getEmployeeMainId()));
            }
            if (rewardPunish.getCategoryRewardPunishId() != null) {
                rewardPunishDTO
                        .setCategoryRewardPunish(categoryRewardPunishService
                                .getOneById(rewardPunish.getCategoryRewardPunishId()));
            }
            rewardPunishDTO.setDate(rewardPunish.getDate());
            rewardPunishDTO.setMoney(rewardPunish.getMoney());
            rewardPunishDTO.setReason(rewardPunish.getReason());
            rewardPunishDTO.setStatus(rewardPunish.getStatus());
        }

        return rewardPunishDTO;
    }

    public List<RewardPunish> getAll() {
        return this.rewardPunishRepository.findAll();
    }

    public List<RewardPunish> getAll(RewardPunishCriteria rewardPunishCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (rewardPunishCriteria.getSort() != null && rewardPunishCriteria.getSort().isPresent()) {
            String sortStr = rewardPunishCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(RewardPunish_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(RewardPunish_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(RewardPunish_.CREATE_AT).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(RewardPunish_.CREATE_AT).descending();
            }
        }

        //
        if (rewardPunishCriteria.getId() == null
                && rewardPunishCriteria.getRestaurantId() == null
                && rewardPunishCriteria.getCreateAtStart() == null
                && rewardPunishCriteria.getCreateAtEnd() == null
                && rewardPunishCriteria.getEmployeeHandleId() == null
                && rewardPunishCriteria.getEmployeeMainId() == null
                && rewardPunishCriteria.getCategoryRewardPunishId() == null
                && rewardPunishCriteria.getDate() == null
                && rewardPunishCriteria.getStatus() == null
                && rewardPunishCriteria.getSort() == null) {
            return this.rewardPunishRepository.findAll();
        }

        //
        Specification<RewardPunish> combinedSpec = Specification.where(null);
        if (rewardPunishCriteria.getId() != null && rewardPunishCriteria.getId().isPresent()) {
            if (rewardPunishCriteria.getId().get().matches("\\d+")) {
                Specification<RewardPunish> currentSpec = RewardPunishSpecification
                        .idEqual(rewardPunishCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (rewardPunishCriteria.getRestaurantId() != null
                && rewardPunishCriteria.getRestaurantId().isPresent()) {
            if (rewardPunishCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<RewardPunish> currentSpec = RewardPunishSpecification
                        .restaurantIdEqual(rewardPunishCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (rewardPunishCriteria.getCreateAtStart() != null
                && rewardPunishCriteria.getCreateAtStart().isPresent()) {
            Specification<RewardPunish> currentSpec = RewardPunishSpecification
                    .createAtAfter(rewardPunishCriteria.getCreateAtStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (rewardPunishCriteria.getCreateAtEnd() != null
                && rewardPunishCriteria.getCreateAtEnd().isPresent()) {
            Specification<RewardPunish> currentSpec = RewardPunishSpecification
                    .createAtBefore(rewardPunishCriteria.getCreateAtEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (rewardPunishCriteria.getEmployeeHandleId() != null
                && rewardPunishCriteria.getEmployeeHandleId().isPresent()) {
            if (rewardPunishCriteria.getEmployeeHandleId().get().matches("\\d+")) {
                Specification<RewardPunish> currentSpec = RewardPunishSpecification
                        .employeeHandleIdEqual(rewardPunishCriteria.getEmployeeHandleId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (rewardPunishCriteria.getEmployeeMainId() != null
                && rewardPunishCriteria.getEmployeeMainId().isPresent()) {
            if (rewardPunishCriteria.getEmployeeMainId().get().matches("\\d+")) {
                Specification<RewardPunish> currentSpec = RewardPunishSpecification
                        .employeeMainIdEqual(rewardPunishCriteria.getEmployeeMainId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (rewardPunishCriteria.getStatus() != null && rewardPunishCriteria.getStatus().isPresent()) {
            String statusString = rewardPunishCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (RewardPunishStatusEnum RewardPunishStatus : RewardPunishStatusEnum.values()) {
                if (RewardPunishStatus.getDescription().equals(statusString)) {
                    statusInteger = RewardPunishStatus.getValue();
                    break;
                }
            }
            Specification<RewardPunish> currentSpec = RewardPunishSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.rewardPunishRepository.findAll(combinedSpec, sort);
    }

    public List<RewardPunishDTO> getAllFormat(RewardPunishCriteria rewardPunishCriteria) {
        List<RewardPunishDTO> listFormat = new ArrayList<>();
        for (RewardPunish rewardPunish : getAll(rewardPunishCriteria)) {
            listFormat.add(getOneFormatById(rewardPunish.getId()));
        }

        return listFormat;
    }

    public List<RewardPunish> getAllByCategoryRewardPunishId(Integer categoryRewardPunishId) {
        return this.rewardPunishRepository.findAllByCategoryRewardPunishId(categoryRewardPunishId);
    }

    public RewardPunish upsert(RewardPunish rewardPunish) {
        return this.rewardPunishRepository.save(rewardPunish);
    }
}