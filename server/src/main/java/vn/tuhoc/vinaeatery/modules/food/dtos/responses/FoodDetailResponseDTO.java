package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private CategoryFoodInfoResponseDTO categoryFood;

    private String image;

    private String name;

    private String unit;

    private Long price;

    private String description;

    @Convert(converter = FoodStatusConverter.class)
    private FoodStatusEnum status;

    private List<RecipeDetailResponseDTO> recipes;
}
