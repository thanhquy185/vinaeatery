package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IngredientCrudResponseDTO {
    private Integer id;

    private CategoryIngredientInfoResponseDTO categoryIngredient;

    private String name;

    private String unit;

    private Long capacity;

    private String dateCreate;

    private String dateRemove;

    private Long inputPrice;

    private Long inventory;

    private String note;
}
