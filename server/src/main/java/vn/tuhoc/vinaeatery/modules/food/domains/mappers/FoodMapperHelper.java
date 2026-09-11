package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.FoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.FoodRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodMapperHelper {
    final FoodRepository foodRepository;
    final FoodMapper foodMapper;

    public FoodEntity mapToEntity(Integer id) {
        return this.foodRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new FoodNotFoundByIdException(id));
    }

    public FoodDetailResponseDTO mapToDetailResponse(FoodEntity foodEntity) {
        return this.foodMapper.entityToDetailResponse(foodEntity);
    }

    public FoodSummaryResponseDTO mapToSummaryResponse(FoodEntity foodEntity) {
        return this.foodMapper.entityToSummaryResponse(foodEntity);
    }

    public FoodCrudResponseDTO mapToCrudResponse(FoodEntity foodEntity) {
        return this.foodMapper.entityToCrudResponse(foodEntity);
    }

    public FoodInfoResponseDTO mapToInfoResponse(FoodEntity foodEntity) {
        return this.foodMapper.entityToInfoResponse(foodEntity);
    }
}