package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodCrudResponseDTO {
    private Integer id;

    private CategoryFoodInfoResponseDTO categoryFood;

    private String image;

    private String name;

    private String unit;

    private Long price;

    private String description;
}
