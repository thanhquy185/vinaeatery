package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FloorUpdateRequestDTO {
    @NotBlank(message = "Tên tầng không được để trống!")
    String name;

    String description;
}
