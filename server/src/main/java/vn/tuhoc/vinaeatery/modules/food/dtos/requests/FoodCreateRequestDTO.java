package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.FoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    Integer employeeId;

    @NotBlank(message = "Tên món ăn không được để trống!")
    String name;

    @NotNull(message = "Loại món ăn không được để trống!")
    Integer categoryFoodId;

    @NotBlank(message = "Đơn vị không được để trống!")
    String unit;

    @NotNull(message = "Giá bán không được để trống!")
    Long price;

    String description;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = FoodStatusConverter.class)
    FoodStatusEnum status;

    List<RecipeCreateRequestDTO> recipes;
}
