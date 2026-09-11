package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

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
public class IngredientCrudResponseDTO {
    Integer id;

    CategoryIngredientInfoResponseDTO categoryIngredient;

    String name;

    String unit;

    Long capacity;

    String dateCreate;

    String dateRemove;

    Long inputPrice;

    Long inventory;

    String note;
}
