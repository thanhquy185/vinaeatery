package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionDetailCreateRequestDTO {
    @NotNull(message = "Mã chức năng không được để trống!")
    Integer functionId;

    @NotBlank(message = "Hành động không được để trống!")
    String action;
}
