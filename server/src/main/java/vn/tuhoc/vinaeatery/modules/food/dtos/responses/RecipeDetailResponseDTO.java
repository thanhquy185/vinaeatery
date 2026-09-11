package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecipeDetailResponseDTO {
    @JsonIgnoreProperties({ "restaurant" })
    IngredientDetailResponseDTO ingredient;

    Long quantity;

    String note;
}
