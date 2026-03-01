package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeForCrud;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleUpdateDTO {
    // Properties
    @NotNull(message = "Tên lịch làm không được để trống!")
    private String name;
    @NotNull(message = "Ngày bắt đầu không được để trống!")
    private String dateStart;
    @NotNull(message = "Ngày kết thúc không được để trống!")
    private String dateEnd;
    private String note;
    @NotNull(message = "Ngày cập nhật không được để trống!")
    private String updateAt;
    private List<ScheduleEmployeeForCrud> scheduleEmployees;
    private List<ScheduleShiftForCrud> scheduleShifts;
}
