package vn.tuhoc.vinaeatery.domain.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "schedules")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Schedule {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @NotNull(message = "Tên lịch làm không được để trống!")
    private String name;
    @NotNull(message = "Ngày bắt đầu không được để trống!")
    private String dateStart;
    @NotNull(message = "Ngày kết thúc không được để trống!")
    private String dateEnd;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String note;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    private String updateAt;
    @Transient
    private List<ScheduleEmployeeForCrud> scheduleEmployees;
    @Transient
    private List<ScheduleShiftForCrud> scheduleShifts;
}
