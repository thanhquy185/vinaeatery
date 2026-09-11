package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionUpdateRequestDTO {
    @NotBlank(message = "Tên quyền hạn không được để trống!")
    String name;

    List<PermissionDetailUpdateRequestDTO> permissionDetails;
}
