package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TableUpdateRequestDTO {
    @NotBlank(message = "Tên bàn ăn không được để trống!")
    private String name;

    @NotNull(message = "Tầng không được để trống!")
    private Integer floorId;

    @NotNull(message = "Loại bàn ăn không được để trống!")
    private Integer categoryTableId;

    @NotNull(message = "Số chỗ ngồi không được để trống!")
    @Min(value = 0)
    private Integer seats;

    private String description;
}
