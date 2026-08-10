package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.EmployeeStatusConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeSummaryResponseDTO {
    private Integer id;

    private UserInfoResponseDTO user;

    private RoleInfoResponseDTO role;

    private PermissionSubInfoResponseDTO permission;

    private String image;

    private String fullname;

    private String birthdate;

    @Convert(converter = CommonGenderConverter.class)
    private CommonGenderEnum gender;

    private String phone;

    private String email;

    private String houseNumber;

    private String streetName;

    private String ward;

    private String province;

    private String description;

    @Convert(converter = EmployeeStatusConverter.class)
    private EmployeeStatusEnum status;
}
