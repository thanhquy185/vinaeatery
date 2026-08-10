package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FoodUpdateRequestDTO {
    @NotBlank(message = "Tên món ăn không được để trống!")
    private String name;

    @NotNull(message = "Loại món ăn không được để trống!")
    private Integer categoryFoodId;

    @NotBlank(message = "Đơn vị không được để trống!")
    private String unit;

    @NotNull(message = "Giá bán không được để trống!")
    private Long price;

    private String description;

    private List<RecipeUpdateRequestDTO> recipes;
}
