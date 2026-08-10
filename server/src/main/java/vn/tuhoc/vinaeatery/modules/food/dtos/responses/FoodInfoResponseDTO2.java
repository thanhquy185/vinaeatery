package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodInfoResponseDTO2 {
    private Integer id;

    private CategoryFoodInfoResponseDTO categoryFood;

    private String image;

    private String name;

    private String unit;

    private Long price;

    private String description;

    @Convert(converter = FoodStatusConverter.class)
    private FoodStatusEnum status;

    List<RecipeDetailResponseDTO> recipes;
}
