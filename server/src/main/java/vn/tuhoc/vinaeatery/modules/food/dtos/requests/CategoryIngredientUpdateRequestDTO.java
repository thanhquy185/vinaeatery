package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryIngredientUpdateRequestDTO {
    @NotBlank(message = "Tên loại bàn ăn không được để trống!")
    private String name;

    private String description;
}
