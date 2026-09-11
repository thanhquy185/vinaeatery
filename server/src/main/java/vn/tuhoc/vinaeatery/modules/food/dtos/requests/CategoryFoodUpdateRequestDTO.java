package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryFoodUpdateRequestDTO {
    @NotBlank(message = "Tên món ăn không được để trống!")
    String name;

    String description;
}
