package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryIngredientUpdateRequestDTO {
    @NotBlank(message = "Tên loại bàn ăn không được để trống!")
    String name;

    String description;
}
