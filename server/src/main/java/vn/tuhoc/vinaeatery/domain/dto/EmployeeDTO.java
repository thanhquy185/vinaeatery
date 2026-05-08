package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.persistence.Convert;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonGenderConverter;
import vn.tuhoc.vinaeatery.repository.converter.EmployeeStatusConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmployeeDTO {
    // Properties
    private Integer id;
    private User user;
    // private RestaurantDTO restaurant;
    private Integer restaurantId;
    private String image;
    private String fullname;
    private String birthday;
    @Convert(converter = CommonGenderConverter.class)
    private CommonGenderEnum gender;
    private String phone;
    private String email;
    private String address;
    private String dateStart;
    private String dateEnd;
    private RoleDTO currentRole;
    private List<RoleHistoryDTO> roleHistories;
    private PermissionDTO permission;
    @Convert(converter = EmployeeStatusConverter.class)
    private EmployeeStatusEnum status;
}
