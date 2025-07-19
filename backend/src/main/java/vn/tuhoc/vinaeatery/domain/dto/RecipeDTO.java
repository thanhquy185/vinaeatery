package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RecipeDTO {
    // Properties
    private Integer ingredientId;
    private String ingredientName;
    private Long ingredientInventory;
    private Long quantity;
    private String note;
}
