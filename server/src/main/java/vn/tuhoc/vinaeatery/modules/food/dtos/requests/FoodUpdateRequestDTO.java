package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodUpdateRequestDTO {
    @NotBlank(message = "Tên món ăn không được để trống!")
    String name;

    @NotNull(message = "Loại món ăn không được để trống!")
    Integer categoryFoodId;

    @NotBlank(message = "Đơn vị không được để trống!")
    String unit;

    @NotNull(message = "Giá bán không được để trống!")
    Long price;

    String description;

    List<RecipeUpdateRequestDTO> recipes;
}
