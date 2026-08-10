package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;

@Data
public class FoodCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotBlank(message = "Tên món ăn không được để trống!")
    private String name;

    @NotNull(message = "Loại món ăn không được để trống!")
    private Integer categoryFoodId;

    @NotBlank(message = "Đơn vị không được để trống!")
    private String unit;

    @NotNull(message = "Giá bán không được để trống!")
    private Long price;

    private String description;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = FoodStatusConverter.class)
    private FoodStatusEnum status;

    private List<RecipeCreateRequestDTO> recipes;
}
