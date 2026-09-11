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

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodInfoResponseDTO2 {
    Integer id;

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
