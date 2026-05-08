package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IngredientUpdateDTO {
    @NotNull(message = "Tên nguyên liệu không được để trống!")
    private String name;
    @NotNull(message = "Loại nguyên liệu không được để trống!")
    private Integer categoryIngredientId;
    private String unit;
    private Long capacity;
    private String dateCreate;
    private String dateRemove;
    private Long inputPrice;
    private String note;
}
