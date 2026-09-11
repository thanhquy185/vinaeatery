package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.RoleSalaryTypeConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleCrudResponseDTO {
    Integer id;

    String name;

    @Convert(converter = RoleSalaryTypeConverter.class)
    RoleSalaryTypeEnum salaryType;

    Long salaryValue;
}
