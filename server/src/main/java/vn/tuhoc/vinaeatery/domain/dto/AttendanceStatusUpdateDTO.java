package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.AttendanceStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AttendanceStatusUpdateDTO {
    // Properties
    @Convert(converter = AttendanceStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private AttendanceStatusEnum status;
    // @NotNull(message = "Thời gian cập nhật không được để trống!")
    // private LocalDateTime updateAt;
}
