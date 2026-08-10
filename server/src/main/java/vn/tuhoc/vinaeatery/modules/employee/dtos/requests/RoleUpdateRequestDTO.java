package vn.tuhoc.vinaeatery.modules.employee.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.RoleSalaryTypeConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;

@Data
public class RoleUpdateRequestDTO {
    @NotBlank(message = "Tên chức vụ không được để trống!")
    private String name;

    @NotNull(message = "Cách tính lương không được để trống!")
    @Convert(converter = RoleSalaryTypeConverter.class)
    private RoleSalaryTypeEnum salaryType;

    @NotNull(message = "Tiền lương không được để trống!")
    private Long salaryValue;
}
