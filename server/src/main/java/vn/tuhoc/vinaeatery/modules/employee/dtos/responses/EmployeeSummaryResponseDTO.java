package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.EmployeeStatusConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeSummaryResponseDTO {
    Integer id;

    UserInfoResponseDTO user;

    RoleInfoResponseDTO role;

    PermissionSubInfoResponseDTO permission;

    String imageUrl;

    String imagePublicId;

    String fullname;

    String birthdate;

    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    String phone;

    String email;

    String houseNumber;

    String streetName;

    String ward;

    String province;

    String description;

    @Convert(converter = EmployeeStatusConverter.class)
    EmployeeStatusEnum status;
}
