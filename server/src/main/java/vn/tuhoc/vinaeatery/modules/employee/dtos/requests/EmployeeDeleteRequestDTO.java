package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import vn.tuhoc.vinaeatery.modules.employee.domains.converters.EmployeeStatusConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;

@Data
public class EmployeeDeleteRequestDTO {
    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = EmployeeStatusConverter.class)
    private EmployeeStatusEnum status;
}
