package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO2;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO3;
import vn.tuhoc.vinaeatery.modules.food.exceptions.FoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.FoodRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodMapperHelper2 {
    final FoodRepository foodRepository;
    final FoodMapper2 foodMapper2;

    public FoodEntity mapToEntity(Integer id) {
        return this.foodRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new FoodNotFoundByIdException(id));
    }

    public FoodInfoResponseDTO mapToInfoResponse(FoodEntity foodEntity) {
        return this.foodMapper2.entityToInfoResponse(foodEntity);
    }

    public FoodInfoResponseDTO2 mapToInfoResponse2(FoodEntity foodEntity) {
        return this.foodMapper2.entityToInfoResponse2(foodEntity);
    }

    public FoodInfoResponseDTO3 mapToInfoResponse3(FoodEntity foodEntity) {
        return this.foodMapper2.entityToInfoResponse3(foodEntity);
    }
}