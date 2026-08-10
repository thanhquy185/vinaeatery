package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import lombok.Data;

@Data
public class RecipeUpdateRequestDTO {
    private Integer ingredientId;

    private Long quantity;

    private String note;
}
