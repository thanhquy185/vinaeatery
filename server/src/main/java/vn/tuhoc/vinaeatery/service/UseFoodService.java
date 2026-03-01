package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.UseFoodDTO;
import vn.tuhoc.vinaeatery.domain.entity.UseFood;
import vn.tuhoc.vinaeatery.domain.entity.UseFood_;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.UseFoodRepository;
import vn.tuhoc.vinaeatery.service.specification.UseFoodSpecification;

@Service
@RequiredArgsConstructor
public class UseFoodService {
    // Properties
    private final EmployeeService employeeService;
    private final FoodService foodService;
    private final UseFoodRepository useFoodRepository;

    // Methods
    public UseFood getOneById(Long id) {
        return this.useFoodRepository.findOneById(id);
    }

    public UseFoodDTO getOneFormatById(Long id) {
        UseFoodDTO useFoodDTO = new UseFoodDTO();
        UseFood useFood = this.useFoodRepository.findOneById(id);
        if (useFood != null) {
            useFoodDTO.setId(useFood.getId());
            useFoodDTO.setRestaurantId(useFood.getRestaurantId());
            useFoodDTO.setTimeStart(useFood.getTimeStart());
            useFoodDTO.setTimeEnd(useFood.getTimeEnd());
            if (useFood.getFoodId() != null) {
                useFoodDTO.setFood(foodService.getOneFormatById(useFood.getFoodId()));
            }
            if (useFood.getEmployeeId() != null) {
                useFoodDTO.setEmployee(employeeService.getOneFormatById(useFood.getEmployeeId()));
            }
            useFoodDTO.setStatus(useFood.getStatus());
        }

        return useFoodDTO;
    }

    public List<UseFood> getAll() {
        return this.useFoodRepository.findAll();
    }

    public List<UseFood> getAll(UseFoodCriteria useFoodCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (useFoodCriteria.getSort() != null && useFoodCriteria.getSort().isPresent()) {
            String sortStr = useFoodCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(UseFood_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(UseFood_.ID).descending();
                case "Thời gian bắt đầu tăng dần" -> sort = Sort.by(UseFood_.TIME_START).ascending();
                case "Thời gian bắt đầu giảm dần" -> sort = Sort.by(UseFood_.TIME_START).descending();
                case "Thời gian kết thúc tăng dần" -> sort = Sort.by(UseFood_.TIME_END).ascending();
                case "Thời gian kết thúc giảm dần" -> sort = Sort.by(UseFood_.TIME_END).descending();
            }
        }

        //
        if (useFoodCriteria.getId() == null
                && useFoodCriteria.getRestaurantId() == null
                && useFoodCriteria.getTimeStart() == null
                && useFoodCriteria.getTimeEnd() == null
                && useFoodCriteria.getEmployeeId() == null
                && useFoodCriteria.getFoodId() == null
                && useFoodCriteria.getFoodName() == null
                && useFoodCriteria.getCategoryFoodId() == null
                && useFoodCriteria.getStatus() == null
                && useFoodCriteria.getSort() == null) {
            return this.useFoodRepository.findAll();
        }

        //
        Specification<UseFood> combinedSpec = Specification.where(null);
        if (useFoodCriteria.getId() != null && useFoodCriteria.getId().isPresent()) {
            if (useFoodCriteria.getId().get().matches("\\d+")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .idEqual(useFoodCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getRestaurantId() != null && useFoodCriteria.getRestaurantId().isPresent()) {
            if (useFoodCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .restaurantIdEqual(useFoodCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getTimeStart() != null && useFoodCriteria.getTimeStart().isPresent()) {
            Specification<UseFood> currentSpec = UseFoodSpecification
                    .timeAfter(useFoodCriteria.getTimeStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (useFoodCriteria.getTimeEnd() != null && useFoodCriteria.getTimeEnd().isPresent()) {
            if (!useFoodCriteria.getTimeEnd().get().equals("null")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .timeBefore(useFoodCriteria.getTimeEnd().get());
                combinedSpec = combinedSpec.and(currentSpec);
            } else {
                sort = Sort.by(UseFood_.FOOD_ID).ascending();
                Specification<UseFood> currentSpec = UseFoodSpecification.timeEndIsNull();
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getFoodId() != null && useFoodCriteria.getFoodId().isPresent()) {
            if (useFoodCriteria.getFoodId().get().matches("\\d+")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .categoryFoodIdEqual(useFoodCriteria.getFoodId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getFoodName() != null && useFoodCriteria.getFoodName().isPresent()) {
            Specification<UseFood> currentSpec = UseFoodSpecification
                    .foodNameLike(useFoodCriteria.getFoodName().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (useFoodCriteria.getCategoryFoodId() != null && useFoodCriteria.getCategoryFoodId().isPresent()) {
            if (useFoodCriteria.getCategoryFoodId().get().matches("\\d+")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .foodIdEqual(useFoodCriteria.getCategoryFoodId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getEmployeeId() != null && useFoodCriteria.getEmployeeId().isPresent()) {
            if (useFoodCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<UseFood> currentSpec = UseFoodSpecification
                        .employeeIdEqual(useFoodCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useFoodCriteria.getStatus() != null && useFoodCriteria.getStatus().isPresent()) {
            String statusString = useFoodCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (UseFoodStatusEnum useFoodStatus : UseFoodStatusEnum.values()) {
                if (useFoodStatus.getDescription().equals(statusString)) {
                    statusInteger = useFoodStatus.getValue();
                    break;
                }
            }
            Specification<UseFood> currentSpec = UseFoodSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.useFoodRepository.findAll(combinedSpec, sort);
    }

    public List<UseFoodDTO> getAllFormat(UseFoodCriteria useFoodCriteria) {
        List<UseFoodDTO> listFormat = new ArrayList<>();
        for (UseFood useFood : getAll(useFoodCriteria)) {
            UseFoodDTO useFoodDTO = new UseFoodDTO();
            useFoodDTO.setId(useFood.getId());
            useFoodDTO.setTimeStart(useFood.getTimeStart());
            useFoodDTO.setTimeEnd(useFood.getTimeEnd());
            if (useFood.getFoodId() != null) {
                useFoodDTO.setFood(foodService.getOneFormatById(useFood.getFoodId()));
            }
            if (useFood.getEmployeeId() != null) {
                useFoodDTO.setEmployee(employeeService.getOneFormatById(useFood.getEmployeeId()));
            }
            useFoodDTO.setStatus(useFood.getStatus());

            listFormat.add(useFoodDTO);
        }

        return listFormat;
    }

    public UseFood upsert(UseFood UseFood) {
        return this.useFoodRepository.save(UseFood);
    }
}
