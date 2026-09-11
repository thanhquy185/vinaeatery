package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableUpdateRequestDTO {
    @NotBlank(message = "Tên bàn ăn không được để trống!")
    String name;

    @NotNull(message = "Tầng không được để trống!")
    Integer floorId;

    @NotNull(message = "Loại bàn ăn không được để trống!")
    Integer categoryTableId;

    @NotNull(message = "Số chỗ ngồi không được để trống!")
    @Min(value = 0)
    Integer seats;

    String description;
}
