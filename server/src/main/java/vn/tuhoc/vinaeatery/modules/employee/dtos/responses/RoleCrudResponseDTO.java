package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.RoleSalaryTypeConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleCrudResponseDTO {
    private Integer id;

    private String name;

    @Convert(converter = RoleSalaryTypeConverter.class)
    private RoleSalaryTypeEnum salaryType;

    private Long salaryValue;
}
