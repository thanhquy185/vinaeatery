package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.EmployeeStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeStatusUpdateDTO {
    // Properties
    @Convert(converter = EmployeeStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private EmployeeStatusEnum status;
}
