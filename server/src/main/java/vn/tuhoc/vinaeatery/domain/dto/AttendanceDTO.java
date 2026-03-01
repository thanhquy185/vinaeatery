package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceLeaveEnum;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.AttendanceLeaveConverter;
import vn.tuhoc.vinaeatery.repository.converter.AttendanceStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AttendanceDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private Integer employeeId;
    private Integer shiftId;
    private String date;
    private String checkIn;
    private String checkOut;
    @Convert(converter = AttendanceLeaveConverter.class)
    private AttendanceLeaveEnum leave;
    @Convert(converter = AttendanceStatusConverter.class)
    private AttendanceStatusEnum status;

    // Getter - Setter
    public String getCheckIn() {
        if (this.checkIn == null)
            return null;
        return this.checkIn.substring(0, 5);
    }

    public String getCheckOut() {
        if (this.checkOut == null)
            return null;
        return this.checkOut.substring(0, 5);
    }
}
