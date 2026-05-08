package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.PermissionDetailForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PermissionUpdateDTO {
    // Properties
    @NotNull(message = "Tên chức vụ không được để trống!")
    private String name;
    private List<PermissionDetailForCrud> permissionDetails;
}
