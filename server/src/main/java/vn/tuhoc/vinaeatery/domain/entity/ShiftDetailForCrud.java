package vn.tuhoc.vinaeatery.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShiftDetailForCrud {
    // Properties
    private Integer shiftId;
    private Integer dayOfWeek;
    private String timeStart;
    private String timeEnd;
}
