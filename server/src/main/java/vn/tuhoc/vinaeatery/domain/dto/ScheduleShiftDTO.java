package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleShiftDTO {
    // Properties
    private Integer scheduleId;
    private Integer shiftId;
    private ShiftDTO shift;
}
