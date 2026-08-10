package vn.tuhoc.vinaeatery.modules.table.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FloorUpdateRequestDTO {
    @NotBlank(message = "Tên tầng không được để trống!")
    private String name;

    private String description;
}
