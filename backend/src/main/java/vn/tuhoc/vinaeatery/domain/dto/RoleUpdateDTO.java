package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.RoleDetailForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleUpdateDTO {
    // Properties
    @NotNull(message = "Tên chức vụ không được để trống !")
    private String name;
    @NotNull(message = "Lương cơ bản không được để trống !")
    private Long salary;
    @NotNull(message = "Thời gian cập nhật không được để trống !")
    private LocalDateTime timeUpdate;
    private List<RoleDetailForCrud> roleDetails;
}
