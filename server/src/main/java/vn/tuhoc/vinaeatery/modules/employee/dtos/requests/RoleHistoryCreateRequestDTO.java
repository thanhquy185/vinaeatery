package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleHistoryCreateRequestDTO {
    @NotNull(message = "Mã chức vụ không được để trống!")
    private Integer roleId;

    @NotNull(message = "Ngày bắt đầu không được để trống!")
    private String dateStart;
}
