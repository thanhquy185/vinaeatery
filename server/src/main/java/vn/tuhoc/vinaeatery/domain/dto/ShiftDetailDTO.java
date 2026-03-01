package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShiftDetailDTO {
    // Properties
    private Integer shiftId;
    private Integer dayOfWeek;
    private String timeStart;
    private String timeEnd;

    // Getter - Setter
    public String getTimeStart() {
        if (this.timeStart == null)
            return null;
        return this.timeStart.substring(0, 5);
    }

    public String getTimeEnd() {
        if (this.timeEnd == null)
            return null;
        return this.timeEnd.substring(0, 5);
    }
}
