package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    CategoryFoodInfoResponseDTO categoryFood;

    String image;

    String name;

    String unit;

    Long price;

    String description;

    @Convert(converter = FoodStatusConverter.class)
    FoodStatusEnum status;

    List<RecipeDetailResponseDTO> recipes;
}
