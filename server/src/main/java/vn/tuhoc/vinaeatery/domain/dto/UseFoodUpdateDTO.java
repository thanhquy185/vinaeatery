package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.UseFoodStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseFoodUpdateDTO {
    private LocalDateTime timeEnd;
    private Integer employeeId;
    @Convert(converter = UseFoodStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private UseFoodStatusEnum status;
}
