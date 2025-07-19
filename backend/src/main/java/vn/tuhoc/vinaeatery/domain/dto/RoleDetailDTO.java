package vn.tuhoc.vinaeatery.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDetailDTO {
    // Properties
    private Integer roleId;
    private Integer functionId;
    private String action;
}
