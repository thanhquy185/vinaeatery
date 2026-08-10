package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import lombok.Data;

@Data
public class RecipeCreateRequestDTO {
    private Integer ingredientId;

    private Long quantity;

    private String note;
}
