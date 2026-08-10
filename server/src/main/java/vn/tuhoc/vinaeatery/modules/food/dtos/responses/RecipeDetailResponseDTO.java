package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RecipeDetailResponseDTO {
    @JsonIgnoreProperties({ "restaurant" })
    private IngredientDetailResponseDTO ingredient;

    private Long quantity;

    private String note;
}
