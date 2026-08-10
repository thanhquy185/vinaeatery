package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PermissionDetailUpdateRequestDTO {
    @NotNull(message = "Mã chức năng không được để trống!")
    private Integer functionId;

    @NotBlank(message = "Hành động không được để trống!")
    private String action;
}
