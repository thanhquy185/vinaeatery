package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IngredientUpdateRequestDTO {
    @NotBlank(message = "Tên nguyên liệu không được để trống!")
    String name;

    @NotNull(message = "Loại nguyên liệu không được để trống!")
    Integer categoryIngredientId;

    @NotNull(message = "Đơn vị tính không được để trống!")
    String unit;

    @NotNull(message = "Dung lượng không được để trống!")
    Long capacity;

    String dateCreate;

    String dateRemove;

    Long inputPrice;

    Long inventory;

    String note;
}
