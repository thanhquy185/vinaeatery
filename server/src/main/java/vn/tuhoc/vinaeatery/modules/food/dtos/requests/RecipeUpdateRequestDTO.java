package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecipeUpdateRequestDTO {
    Integer ingredientId;

    Long quantity;

    String note;
}
