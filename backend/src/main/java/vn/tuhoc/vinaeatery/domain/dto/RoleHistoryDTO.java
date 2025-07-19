package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleHistoryDTO {
    // Properties
    private Integer employeeId;
    private Integer roleId;
    private String roleName;
    private String dateBegin;
    private String dateEnd;
}
