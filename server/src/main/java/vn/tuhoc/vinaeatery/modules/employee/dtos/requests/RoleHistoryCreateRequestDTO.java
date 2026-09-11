package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleHistoryCreateRequestDTO {
    @NotNull(message = "Mã chức vụ không được để trống!")
    Integer roleId;

    @NotNull(message = "Ngày bắt đầu không được để trống!")
    String dateStart;
}
