package vn.tuhoc.vinaeatery.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceLeaveEnum;
import vn.tuhoc.vinaeatery.repository.converter.AttendanceStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.AttendanceLeaveConverter;

@Entity
@Table(name = "attendances")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Attendance {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;
    @NotNull(message = "Mã ca làm không được để trống!")
    private Integer shiftId;
    @Column(columnDefinition = "DATE")
    private String date;
    @JsonFormat(pattern = "HH:mm")
    @Column(columnDefinition = "TIME")
    private String checkIn;
    @JsonFormat(pattern = "HH:mm")
    @Column(columnDefinition = "TIME")
    private String checkOut;
    @Column(name = "leave_status")
    @Convert(converter = AttendanceLeaveConverter.class)
    private AttendanceLeaveEnum leave;
    @Convert(converter = AttendanceStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private AttendanceStatusEnum status;
}
