package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String name;
    private String dateStart;
    private String dateEnd;
    private String note;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    private String updateAt;
    private List<ScheduleEmployeeDTO> scheduleEmployees;
    private List<ScheduleShiftDTO> scheduleShifts;
}
