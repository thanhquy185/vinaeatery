package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryFoodUpdateRequestDTO {
    @NotBlank(message = "Tên món ăn không được để trống!")
    private String name;

    private String description;
}
