package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PermissionUpdateRequestDTO {
    @NotBlank(message = "Tên quyền hạn không được để trống!")
    private String name;

    private List<PermissionDetailUpdateRequestDTO> permissionDetails;
}
