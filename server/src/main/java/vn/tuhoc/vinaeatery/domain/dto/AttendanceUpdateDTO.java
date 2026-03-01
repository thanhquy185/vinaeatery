package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
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
public class AttendanceUpdateDTO {
    // Properties
    private String checkIn;
    private String checkOut;
    @Convert(converter = AttendanceLeaveConverter.class)
    private AttendanceLeaveEnum leave;
    @Convert(converter = AttendanceStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private AttendanceStatusEnum status;
}
