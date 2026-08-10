package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryIngredientCrudResponseDTO {
    private Integer id;

    private String name;

    private String description;
}
