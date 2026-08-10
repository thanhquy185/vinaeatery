package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IngredientUpdateRequestDTO {
    @NotBlank(message = "Tên nguyên liệu không được để trống!")
    private String name;

    @NotNull(message = "Loại nguyên liệu không được để trống!")
    private Integer categoryIngredientId;

    @NotNull(message = "Đơn vị tính không được để trống!")
    private String unit;

    @NotNull(message = "Dung lượng không được để trống!")
    private Long capacity;

    private String dateCreate;

    private String dateRemove;

    private Long inputPrice;

    private Long inventory;

    private String note;
}
